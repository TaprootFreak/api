const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class Initial1693381371362 {
  name = 'Initial1693381371362';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet_provider" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" varchar(255) NOT NULL, CONSTRAINT "UQ_1e7a695e2f2ea4ca54df5f0fc72" UNIQUE ("name"), CONSTRAINT "PK_5c7933595d00e530f9d0eecca81" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "address" varchar(255) NOT NULL, "signature" varchar(255) NOT NULL, "lnbitsUserId" varchar(255) NOT NULL, "lnbitsAddress" varchar(255) NOT NULL, "role" varchar(255) NOT NULL DEFAULT 'User', "walletProviderId" int NOT NULL, "userId" int NOT NULL, CONSTRAINT "UQ_1dcc9f5fd49e3dc52c6d2393c53" UNIQUE ("address"), CONSTRAINT "UQ_55b77268e1ab3d6caba35c2e1f7" UNIQUE ("lnbitsUserId"), CONSTRAINT "UQ_a380084e2f3e0213d45ce414129" UNIQUE ("lnbitsAddress"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lightning_wallet" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "lnbitsWalletId" varchar(255) NOT NULL, "asset" varchar(255) NOT NULL, "adminKey" varchar(255) NOT NULL, "invoiceKey" varchar(255) NOT NULL, "lnurlpId" varchar(255) NOT NULL, "walletId" int NOT NULL, CONSTRAINT "UQ_60f18254b76b69d24553d8c0562" UNIQUE ("lnbitsWalletId"), CONSTRAINT "PK_ea0c4797a4f0f6d0b9979e8a432" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_5f9d93bd5c22ed5b4211b26718a" FOREIGN KEY ("walletProviderId") REFERENCES "wallet_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lightning_wallet" ADD CONSTRAINT "FK_ebc8d061296752d702c459dfc20" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "lightning_wallet" DROP CONSTRAINT "FK_ebc8d061296752d702c459dfc20"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
    await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_5f9d93bd5c22ed5b4211b26718a"`);
    await queryRunner.query(`DROP TABLE "lightning_wallet"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
    await queryRunner.query(`DROP TABLE "wallet_provider"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
};
