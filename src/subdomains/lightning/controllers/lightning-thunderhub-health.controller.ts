import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Config } from 'src/config/config';
import { LightningLogger } from 'src/shared/services/lightning-logger';
import { HttpService } from 'src/shared/services/http.service';

@ApiTags('ThunderHub')
@Controller('thunderhub')
export class LightningThunderhubHealthController {
  private readonly logger = new LightningLogger(LightningThunderhubHealthController);

  constructor(private readonly http: HttpService) {}

  @Get('health')
  async health(): Promise<{ up: true }> {
    const url = Config.blockchain.lightning.thunderhub.apiUrl;

    if (!url) {
      throw new HttpException(
        { up: false, error: 'LIGHTNING_THUNDERHUB_URL not configured' },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      await this.http.request<string>({
        url,
        method: 'GET',
        responseType: 'text',
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
      });
      return { up: true };
    } catch (e) {
      this.logger.warn(`ThunderHub health probe failed: ${e.message}`);
      throw new HttpException({ up: false, error: e.message }, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
