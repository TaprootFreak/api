import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from 'src/shared/db/base.repository';
import { EntityManager, Equal } from 'typeorm';
import { LightningWalletEntity } from '../../domain/entities/lightning-wallet.entity';
import { LightningWalletTotalBalanceDto } from '../dto/lightning-wallet.dto';

@Injectable()
export class LightningWalletRepository extends BaseRepository<LightningWalletEntity> {
  constructor(manager: EntityManager) {
    super(LightningWalletEntity, manager);
  }

  async getByWalletId(lnbitsWalletId: string): Promise<LightningWalletEntity> {
    const lightningWallet = await this.findOneBy({ lnbitsWalletId: Equal(lnbitsWalletId) });
    if (!lightningWallet) throw new NotFoundException(`Lnbits Wallet not found by id ${lnbitsWalletId}`);

    return lightningWallet;
  }

  async getInternalBalances(internalLnbitsWalletIds: string[]): Promise<LightningWalletTotalBalanceDto[]> {
    if (!internalLnbitsWalletIds.length) return [];

    return this.createQueryBuilder('lw')
      .select('lw.asset.id', 'assetId')
      .addSelect('SUM(lw.balance)', 'totalBalance')
      .where('lw.lnbitsWalletId IN (:...internalLnbitsWalletIds)', { internalLnbitsWalletIds })
      .groupBy('lw.asset.id')
      .getRawMany<LightningWalletTotalBalanceDto>();
  }

  async getCustomerBalances(excludeLnbitsWalletIds: string[]): Promise<LightningWalletTotalBalanceDto[]> {
    const query = this.createQueryBuilder('lw')
      .select('lw.asset.id', 'assetId')
      .addSelect('SUM(lw.balance)', 'totalBalance')
      .groupBy('lw.asset.id');

    if (excludeLnbitsWalletIds.length) {
      query.where('lw.lnbitsWalletId NOT IN (:...excludeLnbitsWalletIds)', { excludeLnbitsWalletIds });
    }

    return query.getRawMany<LightningWalletTotalBalanceDto>();
  }
}
