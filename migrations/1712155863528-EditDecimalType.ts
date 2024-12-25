import { MigrationInterface, QueryRunner } from "typeorm";

export class EditDecimalType1712155863528 implements MigrationInterface {
    name = 'EditDecimalType1712155863528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`health_topics\` CHANGE \`icon\` \`icon\` varchar(64) NULL`);
        await queryRunner.query(`ALTER TABLE \`health_topics\` CHANGE \`description\` \`description\` varchar(300) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_habits\` CHANGE \`startDate\` \`startDate\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`user_habits\` CHANGE \`endDate\` \`endDate\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habits\` CHANGE \`icon\` \`icon\` varchar(64) NULL`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habits\` CHANGE \`description\` \`description\` varchar(300) NULL`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habit_tasks\` CHANGE \`icon\` \`icon\` varchar(64) NULL`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habit_tasks\` CHANGE \`description\` \`description\` varchar(300) NULL`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habit_task_histories\` DROP FOREIGN KEY \`FK_b47b49edcc4ecaf99d4b8631300\``);
        await queryRunner.query(`ALTER TABLE \`health_topic_habit_task_histories\` CHANGE \`tasksId\` \`tasksId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(320) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`point\` \`point\` decimal(18,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`height\` \`height\` decimal(5,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`weight\` \`weight\` decimal(4,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`minings\` DROP FOREIGN KEY \`FK_241db6da944524f8bc56f5e6814\``);
        await queryRunner.query(`ALTER TABLE \`minings\` CHANGE \`point\` \`point\` decimal(18,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`minings\` CHANGE \`userId\` \`userId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habit_task_histories\` ADD CONSTRAINT \`FK_b47b49edcc4ecaf99d4b8631300\` FOREIGN KEY (\`tasksId\`) REFERENCES \`health_topic_habit_tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`minings\` ADD CONSTRAINT \`FK_241db6da944524f8bc56f5e6814\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`minings\` DROP FOREIGN KEY \`FK_241db6da944524f8bc56f5e6814\``);
        await queryRunner.query(`ALTER TABLE \`health_topic_habit_task_histories\` DROP FOREIGN KEY \`FK_b47b49edcc4ecaf99d4b8631300\``);
        await queryRunner.query(`ALTER TABLE \`minings\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`minings\` CHANGE \`point\` \`point\` decimal(3,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`minings\` ADD CONSTRAINT \`FK_241db6da944524f8bc56f5e6814\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`weight\` \`weight\` decimal(3,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`height\` \`height\` decimal(3,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`point\` \`point\` decimal(3,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(320) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habit_task_histories\` CHANGE \`tasksId\` \`tasksId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habit_task_histories\` ADD CONSTRAINT \`FK_b47b49edcc4ecaf99d4b8631300\` FOREIGN KEY (\`tasksId\`) REFERENCES \`health_topic_habit_tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habit_tasks\` CHANGE \`description\` \`description\` varchar(300) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habit_tasks\` CHANGE \`icon\` \`icon\` varchar(64) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habits\` CHANGE \`description\` \`description\` varchar(300) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`health_topic_habits\` CHANGE \`icon\` \`icon\` varchar(64) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_habits\` CHANGE \`endDate\` \`endDate\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_habits\` CHANGE \`startDate\` \`startDate\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`health_topics\` CHANGE \`description\` \`description\` varchar(300) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`health_topics\` CHANGE \`icon\` \`icon\` varchar(64) NULL DEFAULT 'NULL'`);
    }

}
