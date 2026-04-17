const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class setupMonitoring1715957540871 {
    name = 'setupMonitoring1715957540871'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "monitoring_balance" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "onchainBalance" double precision NOT NULL, "lightningBalance" double precision NOT NULL, "customerBalance" double precision NOT NULL, "assetId" int, CONSTRAINT "PK_7b5964e6f913159bfdbd4604087" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "monitoring" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "type" varchar(255) NOT NULL, "name" varchar(255) NOT NULL, "value" varchar(255) NOT NULL, CONSTRAINT "PK_22a9f9562020245a98bd2c4fb3c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c132236516bf54a888017a59ac" ON "monitoring" ("type", "name") `);
        await queryRunner.query(`ALTER TABLE "monitoring_balance" ADD CONSTRAINT "FK_6e507ef4194b68b0ca0ff02023e" FOREIGN KEY ("assetId") REFERENCES "asset_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "monitoring_balance" DROP CONSTRAINT "FK_6e507ef4194b68b0ca0ff02023e"`);
        await queryRunner.query(`DROP INDEX "IDX_c132236516bf54a888017a59ac"`);
        await queryRunner.query(`DROP TABLE "monitoring"`);
        await queryRunner.query(`DROP TABLE "monitoring_balance"`);
    }
}
