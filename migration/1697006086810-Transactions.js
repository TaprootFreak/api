const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Transactions1697006086810 {
    name = 'Transactions1697006086810'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user_transaction" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "type" varchar(255) NOT NULL, "amount" double precision NOT NULL, "fee" double precision NOT NULL DEFAULT 0, "balance" double precision, "creationTimestamp" timestamp NOT NULL, "expiresTimestamp" timestamp, "tag" varchar(255), "lightningWalletId" int, "lightningTransactionId" int NOT NULL, CONSTRAINT "PK_e36b77a5263ac0f191277c4c5d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_lightning" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "type" varchar(255) NOT NULL, "state" varchar(255) NOT NULL, "transaction" varchar(255) NOT NULL, "secret" varchar(255) NOT NULL, "publicKey" varchar(255), "amount" double precision NOT NULL, "fee" double precision NOT NULL DEFAULT 0, "balance" double precision, "creationTimestamp" timestamp NOT NULL, "expiresTimestamp" timestamp, "confirmedTimestamp" timestamp, "description" text, "reason" varchar(255), "paymentRequest" text, CONSTRAINT "PK_4f9024cfed331c3c379a9b481c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_onchain" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "transaction" varchar(255) NOT NULL, "amount" double precision NOT NULL, "fee" double precision NOT NULL DEFAULT 0, "balance" double precision, "block" int NOT NULL, "timestamp" timestamp NOT NULL, CONSTRAINT "UQ_8a233973c49afbbc14a01ce076b" UNIQUE ("transaction"), CONSTRAINT "PK_00b0ebb5b154922c59e2b502d19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lightning_wallet" ADD "balance" double precision NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user_transaction" ADD CONSTRAINT "FK_34942e502f3c64e570462407e2a" FOREIGN KEY ("lightningWalletId") REFERENCES "lightning_wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_transaction" ADD CONSTRAINT "FK_b2a00eab28ff6b7052c4eee695f" FOREIGN KEY ("lightningTransactionId") REFERENCES "transaction_lightning"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_transaction" DROP CONSTRAINT "FK_b2a00eab28ff6b7052c4eee695f"`);
        await queryRunner.query(`ALTER TABLE "user_transaction" DROP CONSTRAINT "FK_34942e502f3c64e570462407e2a"`);
        await queryRunner.query(`ALTER TABLE "lightning_wallet" DROP COLUMN "balance"`);
        await queryRunner.query(`DROP TABLE "transaction_onchain"`);
        await queryRunner.query(`DROP TABLE "transaction_lightning"`);
        await queryRunner.query(`DROP TABLE "user_transaction"`);
    }
}
