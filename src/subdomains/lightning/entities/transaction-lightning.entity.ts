import { IEntity } from 'src/shared/db/entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserTransactionEntity } from '../../user/domain/entities/user-transaction.entity';

export enum TransactionLightningType {
  INVOICE = 'invoice',
  PAYMENT = 'payment',
  ROUTING = 'routing',
}

export enum TransactionLightningState {
  // Payment:
  // https://lightning.engineering/api-docs/api/lnd/lightning/list-payments#lnrpcpaymentpaymentstatus
  UNKNOWN = 'unknown',
  IN_FLIGHT = 'inflight',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  INITIATED = 'initiated',

  // Invoice:
  // https://lightning.engineering/api-docs/api/lnd/lightning/list-invoices#lnrpcinvoiceinvoicestate
  OPEN = 'open',
  SETTLED = 'settled',
  CANCELED = 'canceled',
  ACCEPTED = 'accepted',
}

@Entity('transaction_lightning')
export class TransactionLightningEntity extends IEntity {
  @Column()
  type: TransactionLightningType;

  @Column()
  state: TransactionLightningState;

  @Column()
  transaction: string;

  @Column()
  secret: string;

  @Column({ nullable: true })
  publicKey?: string;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({ type: 'double precision', default: 0 })
  fee: number;

  @Column({ type: 'double precision', nullable: true })
  balance?: number;

  @Column({ type: 'timestamp' })
  creationTimestamp: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresTimestamp?: Date;

  @Column({ type: 'timestamp', nullable: true })
  confirmedTimestamp?: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  reason?: string;

  @Column({ type: 'text', nullable: true })
  paymentRequest?: string;

  @OneToMany(() => UserTransactionEntity, (tx) => tx.lightningTransaction, { eager: true })
  userTransactions: UserTransactionEntity[];
}
