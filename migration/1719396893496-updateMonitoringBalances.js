const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class updateMonitoringBalances1719396893496 {
    name = 'updateMonitoringBalances1719396893496'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "monitoring_balance" ADD "assetPriceInCHF" double precision NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "monitoring_balance" ADD "ldsBalance" double precision NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "monitoring_balance" ADD "ldsBalanceInCHF" double precision NOT NULL DEFAULT 0`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "monitoring_balance" DROP COLUMN "ldsBalanceInCHF"`);
        await queryRunner.query(`ALTER TABLE "monitoring_balance" DROP COLUMN "ldsBalance"`);
        await queryRunner.query(`ALTER TABLE "monitoring_balance" DROP COLUMN "assetPriceInCHF"`);
    }
}
