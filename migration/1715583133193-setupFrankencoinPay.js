const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class setupFrankencoinPay1715583133193 {
    name = 'setupFrankencoinPay1715583133193'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lightning_wallet" DROP CONSTRAINT "FK_37f046b3cbbb273f24a4badd1f7"`);
        await queryRunner.query(`CREATE TABLE "asset_transfer" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" varchar(255) NOT NULL, "displayName" varchar(255) NOT NULL, "status" varchar(255) NOT NULL, "blockchain" varchar(255) NOT NULL, "address" varchar(255), CONSTRAINT "PK_d6055020b87303085fec8d88f5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c364ba178533de8c281fe34b64" ON "asset_transfer" ("name", "blockchain") `);

        await queryRunner.query(`ALTER TABLE "asset" RENAME TO "asset_account"`);
        await queryRunner.query(`ALTER TABLE "asset_account" ADD "symbol" varchar(255)`);
        await queryRunner.query(`ALTER TABLE "asset_account" ADD "minSendable" smallint`);
        await queryRunner.query(`ALTER TABLE "asset_account" ADD "maxSendable" bigint`);
        await queryRunner.query(`ALTER TABLE "asset_account" ADD "decimals" smallint`);

        await queryRunner.query(`CREATE TABLE "payment_request" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "state" varchar(255) NOT NULL, "invoiceAmount" double precision NOT NULL, "transferAmount" double precision NOT NULL, "paymentRequest" text NOT NULL, "expiryDate" timestamp NOT NULL, "paymentMethod" varchar(255) NOT NULL, "errorMessage" text, "invoiceAssetId" int, "transferAssetId" int, "lightningWalletId" int, CONSTRAINT "PK_b274a8e7b35dd0fd12e46e89f3c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_evm" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "state" varchar(255) NOT NULL, "amount" double precision NOT NULL, "transaction" varchar(255) NOT NULL, "errorMessage" text, "assetId" int, CONSTRAINT "PK_da8f5f87acf951be71790cbf71e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_transaction" ADD "evmTransactionId" int`);
        await queryRunner.query(`ALTER TABLE "user_transaction" ADD "paymentRequestId" int`);
        await queryRunner.query(`ALTER TABLE "user_transaction" DROP CONSTRAINT "FK_b2a00eab28ff6b7052c4eee695f"`);
        await queryRunner.query(`ALTER TABLE "user_transaction" ALTER COLUMN "lightningTransactionId" DROP NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_5321f899f7b93e29184aca2e76" ON "user_transaction" ("evmTransactionId") WHERE "evmTransactionId" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_c5c971bdda1132ff33afab0f3d" ON "user_transaction" ("paymentRequestId") WHERE "paymentRequestId" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lightning_wallet" ADD CONSTRAINT "FK_37f046b3cbbb273f24a4badd1f7" FOREIGN KEY ("assetId") REFERENCES "asset_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_request" ADD CONSTRAINT "FK_653ab346cbd9f7297e2bff279fa" FOREIGN KEY ("invoiceAssetId") REFERENCES "asset_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_request" ADD CONSTRAINT "FK_7d73326cc4a41f52df8e1924903" FOREIGN KEY ("transferAssetId") REFERENCES "asset_transfer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_request" ADD CONSTRAINT "FK_cd377dc658d6351cff4526ceb7f" FOREIGN KEY ("lightningWalletId") REFERENCES "lightning_wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_transaction" ADD CONSTRAINT "FK_b2a00eab28ff6b7052c4eee695f" FOREIGN KEY ("lightningTransactionId") REFERENCES "transaction_lightning"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_transaction" ADD CONSTRAINT "FK_5321f899f7b93e29184aca2e760" FOREIGN KEY ("evmTransactionId") REFERENCES "transaction_evm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_transaction" ADD CONSTRAINT "FK_c5c971bdda1132ff33afab0f3d9" FOREIGN KEY ("paymentRequestId") REFERENCES "payment_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_evm" ADD CONSTRAINT "FK_a1b5c600668f6899efd03961f30" FOREIGN KEY ("assetId") REFERENCES "asset_transfer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`UPDATE "asset_account" SET "status" = 'active' WHERE "status" = 'Active'`);
        await queryRunner.query(`UPDATE "asset_account" SET "status" = 'inactive' WHERE "status" = 'ComingSoon'`);

        await queryRunner.query(`UPDATE "asset_account" SET "symbol" = 'B', "minSendable" = 1, "maxSendable" = 100000000, "decimals" = 8 WHERE "name" = 'BTC'`);
        await queryRunner.query(`UPDATE "asset_account" SET "symbol" = '$', "minSendable" = 1, "maxSendable" = 1000000, "decimals" = 2 WHERE "name" = 'USD'`);
        await queryRunner.query(`UPDATE "asset_account" SET "symbol" = '₣', "minSendable" = 1, "maxSendable" = 1000000, "decimals" = 2 WHERE "name" = 'CHF'`);
        await queryRunner.query(`UPDATE "asset_account" SET "symbol" = '€', "minSendable" = 1, "maxSendable" = 1000000, "decimals" = 2 WHERE "name" = 'EUR'`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction_evm" DROP CONSTRAINT "FK_a1b5c600668f6899efd03961f30"`);
        await queryRunner.query(`ALTER TABLE "user_transaction" DROP CONSTRAINT "FK_c5c971bdda1132ff33afab0f3d9"`);
        await queryRunner.query(`ALTER TABLE "user_transaction" DROP CONSTRAINT "FK_5321f899f7b93e29184aca2e760"`);
        await queryRunner.query(`ALTER TABLE "user_transaction" DROP CONSTRAINT "FK_b2a00eab28ff6b7052c4eee695f"`);
        await queryRunner.query(`ALTER TABLE "payment_request" DROP CONSTRAINT "FK_cd377dc658d6351cff4526ceb7f"`);
        await queryRunner.query(`ALTER TABLE "payment_request" DROP CONSTRAINT "FK_7d73326cc4a41f52df8e1924903"`);
        await queryRunner.query(`ALTER TABLE "payment_request" DROP CONSTRAINT "FK_653ab346cbd9f7297e2bff279fa"`);
        await queryRunner.query(`ALTER TABLE "lightning_wallet" DROP CONSTRAINT "FK_37f046b3cbbb273f24a4badd1f7"`);
        await queryRunner.query(`DROP INDEX "REL_c5c971bdda1132ff33afab0f3d"`);
        await queryRunner.query(`DROP INDEX "REL_5321f899f7b93e29184aca2e76"`);
        await queryRunner.query(`ALTER TABLE "user_transaction" ALTER COLUMN "lightningTransactionId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_transaction" ADD CONSTRAINT "FK_b2a00eab28ff6b7052c4eee695f" FOREIGN KEY ("lightningTransactionId") REFERENCES "transaction_lightning"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_transaction" DROP COLUMN "paymentRequestId"`);
        await queryRunner.query(`ALTER TABLE "user_transaction" DROP COLUMN "evmTransactionId"`);
        await queryRunner.query(`DROP TABLE "transaction_evm"`);
        await queryRunner.query(`DROP TABLE "payment_request"`);
        await queryRunner.query(`DROP INDEX "IDX_c364ba178533de8c281fe34b64"`);
        await queryRunner.query(`DROP TABLE "asset_transfer"`);

        await queryRunner.query(`ALTER TABLE "asset_account" RENAME TO "asset"`);
        await queryRunner.query(`ALTER TABLE "lightning_wallet" ADD CONSTRAINT "FK_37f046b3cbbb273f24a4badd1f7" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`UPDATE "asset" SET "status" = 'Active' WHERE "status" = 'active'`);
        await queryRunner.query(`UPDATE "asset" SET "status" = 'ComingSoon' WHERE "status" = 'inactive'`);

        await queryRunner.query(`ALTER TABLE "asset" DROP COLUMN "symbol"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP COLUMN "minSendable"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP COLUMN "maxSendable"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP COLUMN "decimals"`);
    }
}
