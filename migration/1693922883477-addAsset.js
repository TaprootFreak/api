const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class addAsset1693922883477 {
    name = 'addAsset1693922883477'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lightning_wallet" RENAME COLUMN "asset" TO "assetId"`);
        await queryRunner.query(`CREATE TABLE "asset" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" varchar(255) NOT NULL, "displayName" varchar(255) NOT NULL, "description" varchar(255), "status" varchar(255) NOT NULL, CONSTRAINT "UQ_119b2d1c1bdccc42057c303c44f" UNIQUE ("name"), CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "addressOwnershipProof" varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "UQ_e27ddf84aefa72d600acbf393c5" UNIQUE ("addressOwnershipProof")`);
        await queryRunner.query(`ALTER TABLE "lightning_wallet" DROP COLUMN "assetId"`);
        await queryRunner.query(`ALTER TABLE "lightning_wallet" ADD "assetId" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lightning_wallet" ADD CONSTRAINT "FK_37f046b3cbbb273f24a4badd1f7" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lightning_wallet" DROP CONSTRAINT "FK_37f046b3cbbb273f24a4badd1f7"`);
        await queryRunner.query(`ALTER TABLE "lightning_wallet" DROP COLUMN "assetId"`);
        await queryRunner.query(`ALTER TABLE "lightning_wallet" ADD "assetId" varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "UQ_e27ddf84aefa72d600acbf393c5"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "addressOwnershipProof"`);
        await queryRunner.query(`DROP TABLE "asset"`);
        await queryRunner.query(`ALTER TABLE "lightning_wallet" RENAME COLUMN "assetId" TO "asset"`);
    }
}
