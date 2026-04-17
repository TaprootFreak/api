/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class CreateMonitoringEvmBalance1770366346107 {
    name = 'CreateMonitoringEvmBalance1770366346107'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "monitoring_evm_balance" ("id" SERIAL NOT NULL, "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "blockchain" varchar(50) NOT NULL, "nativeSymbol" varchar(10) NOT NULL, "nativeBalance" double precision NOT NULL DEFAULT 0, "tokenBalances" text, CONSTRAINT "PK_9e27ea97b0eb8872a956abd8e2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_708ecfcf63cd709863b65da2e1" ON "monitoring_evm_balance" ("blockchain") `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_708ecfcf63cd709863b65da2e1"`);
        await queryRunner.query(`DROP TABLE "monitoring_evm_balance"`);
    }
}
