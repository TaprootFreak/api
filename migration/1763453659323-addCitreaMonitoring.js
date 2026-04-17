const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class addCitreaMonitoring1763453659323 {
    name = 'addCitreaMonitoring1763453659323'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "monitoring_balance" ADD "citreaBalance" double precision NOT NULL DEFAULT 0`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "monitoring_balance" DROP COLUMN "citreaBalance"`);
    }
}
