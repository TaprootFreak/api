import { IEntity } from 'src/shared/db/entity';
import { Column, Entity } from 'typeorm';

@Entity('transaction_onchain')
export class TransactionOnchainEntity extends IEntity {
  @Column({ unique: true })
  transaction: string;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({ type: 'double precision', default: 0 })
  fee: number;

  @Column({ type: 'double precision', nullable: true })
  balance?: number;

  @Column({ type: 'int' })
  block: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
