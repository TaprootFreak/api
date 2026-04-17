const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class changeMonitoringColumns1762853446614 {
    name = 'changeMonitoringColumns1762853446614'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "monitoring_balance" ALTER COLUMN "lightningBalance" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "monitoring_balance" ALTER COLUMN "customerBalance" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "monitoring_balance" ADD "rootstockBalance" double precision NOT NULL DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "monitoring_balance" RENAME COLUMN "onchainBalance" TO "lndOnchainBalance"`);
        await queryRunner.query(`ALTER TABLE "monitoring_balance" ALTER COLUMN "lndOnchainBalance" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "monitoring_balance" ADD "onchainBalance" double precision NOT NULL DEFAULT 0`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "monitoring_balance" DROP COLUMN "onchainBalance"`);
        await queryRunner.query(`ALTER TABLE "monitoring_balance" ALTER COLUMN "lndOnchainBalance" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "monitoring_balance" RENAME COLUMN "lndOnchainBalance" TO "onchainBalance"`);

        await queryRunner.query(`ALTER TABLE "monitoring_balance" DROP COLUMN "rootstockBalance"`);

        await queryRunner.query(`ALTER TABLE "monitoring_balance" ALTER COLUMN "customerBalance" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "monitoring_balance" ALTER COLUMN "lightningBalance" DROP DEFAULT`);
    }
}
