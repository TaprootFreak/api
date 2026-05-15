import { Injectable, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { GetConfig } from 'src/config/config';
import { LightningLogger } from 'src/shared/services/lightning-logger';
import { Price } from '../../support/dto/price.dto';

// Talks to a CoinGecko-compatible endpoint. The default deployment routes
// through the in-cluster pricing-proxy (https://github.com/DFXswiss/pricing-proxy)
// so the upstream key lives in one place and the 60 s cache + quota monitor
// apply. Setting `COINGECKO_BASE_URL` to `https://pro-api.coingecko.com` (or
// `https://api.coingecko.com`) makes the service talk to CoinGecko directly,
// in which case `COINGECKO_API_KEY` is attached as `x-cg-pro-api-key`.
@Injectable()
export class CoinGeckoService implements OnModuleInit {
  private readonly logger = new LightningLogger(CoinGeckoService);

  private readonly http: AxiosInstance;
  private currencies: string[] = [];

  constructor() {
    const baseUrl = GetConfig().coinGecko.baseUrl;
    if (!baseUrl) throw new Error('COINGECKO_BASE_URL is not set');

    const headers: Record<string, string> = { Accept: 'application/json' };
    const apiKey = GetConfig().coinGecko.apiKey;
    if (apiKey) headers['x-cg-pro-api-key'] = apiKey;

    this.http = axios.create({ baseURL: baseUrl, headers, timeout: 10_000 });
  }

  async onModuleInit(): Promise<void> {
    try {
      const { data } = await this.http.get<string[]>('/api/v3/simple/supported_vs_currencies');
      this.currencies = Array.isArray(data) ? data : [];
    } catch (e) {
      this.logger.error('Failed to load CoinGecko currencies on startup', e);
    }
  }

  async getPrice(from: string, to: string): Promise<Price> {
    const fromCurrency = this.getCurrency(from);
    const toCurrency = this.getCurrency(to);

    if (fromCurrency && toCurrency) {
      const [priceFrom, priceTo] = await Promise.all([
        this.fetchPrice('tether', fromCurrency),
        this.fetchPrice('tether', toCurrency),
      ]);
      return Price.join(priceFrom.invert(), priceTo);
    } else if (fromCurrency) {
      const price = await this.fetchPrice(to, fromCurrency);
      return price.invert();
    } else if (toCurrency) {
      return this.fetchPrice(from, toCurrency);
    } else {
      const [priceFrom, priceTo] = await Promise.all([this.fetchPrice(from, 'usd'), this.fetchPrice(to, 'usd')]);
      return Price.join(priceFrom, priceTo.invert());
    }
  }

  // --- HELPER METHODS --- //

  private async fetchPrice(token: string, currency: string): Promise<Price> {
    try {
      const { data } = await this.http.get<Record<string, Record<string, number>>>('/api/v3/simple/price', {
        params: { ids: token, vs_currencies: currency },
      });
      const price = data?.[token]?.[currency];
      if (!price) throw new Error('Price not found');

      return Price.create(token, currency, 1 / price);
    } catch (e) {
      this.logger.error(`Failed to get price for ${token} -> ${currency}:`, e);
      throw new ServiceUnavailableException(`Failed to get price`);
    }
  }

  private getCurrency(token: string): string | undefined {
    return this.currencies.find((c) => c === token.toLowerCase());
  }
}
