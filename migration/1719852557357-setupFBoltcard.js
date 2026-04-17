const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class setupFBoltcard1719852557357 {
    name = 'setupFBoltcard1719852557357'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user_boltcard" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "status" varchar(255) NOT NULL, "boltcardId" varchar(255) NOT NULL, "cardName" varchar(255) NOT NULL, "uid" varchar(255) NOT NULL, "externalId" varchar(255) NOT NULL, "counter" int NOT NULL, "txLimit" double precision NOT NULL, "dailyLimit" double precision NOT NULL, "k0" varchar(255) NOT NULL, "k1" varchar(255) NOT NULL, "k2" varchar(255) NOT NULL, "prevK0" varchar(255) NOT NULL, "prevK1" varchar(255) NOT NULL, "prevK2" varchar(255) NOT NULL, "otp" varchar(255) NOT NULL, "creationTimestamp" timestamp NOT NULL, "lightningWalletId" int, CONSTRAINT "UQ_2034c8acba4ab8768438fdabca8" UNIQUE ("boltcardId"), CONSTRAINT "PK_10389273e8cfe09471c5f955a80" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_boltcard" ADD CONSTRAINT "FK_92759113274277cf294bd6ccde9" FOREIGN KEY ("lightningWalletId") REFERENCES "lightning_wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_boltcard" DROP CONSTRAINT "FK_92759113274277cf294bd6ccde9"`);
        await queryRunner.query(`DROP TABLE "user_boltcard"`);
    }
}
