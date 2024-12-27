import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitTable1711978776555 implements MigrationInterface {
  name = 'InitTable1711978776555'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE configs (id varchar(36) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), isDeleted tinyint NOT NULL DEFAULT 0, name varchar(64) NOT NULL, value varchar(160) NOT NULL, description varchar(200) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE health_topics (id varchar(36) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), isDeleted tinyint NOT NULL DEFAULT 0, name varchar(200) NOT NULL, icon varchar(64) NULL, description varchar(300) NULL, PRIMARY KEY (id)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE user_habits (id varchar(36) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), isDeleted tinyint NOT NULL DEFAULT 0, habitId varchar(36) NOT NULL, consumerId varchar(36) NOT NULL, startDate datetime NULL, endDate datetime NULL, UNIQUE INDEX REL_0b7d751fc3a1337bc51088a6ac (habitId), PRIMARY KEY (id)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE health_topic_habits (id varchar(36) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), isDeleted tinyint NOT NULL DEFAULT 0, name varchar(200) NOT NULL, icon varchar(64) NULL, description varchar(300) NULL, days int NOT NULL DEFAULT 10, exp int NOT NULL DEFAULT 0, rating decimal(3,1) NOT NULL, topicId varchar(36) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE health_topic_habit_task_histories (id varchar(36) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), isDeleted tinyint NOT NULL DEFAULT 0, consumerId varchar(36) NOT NULL, taskId varchar(36) NOT NULL, tasksId varchar(36) NULL, isDone bool DEFAULT FALSE, PRIMARY KEY (id)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE health_topic_habit_tasks (id varchar(36) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), isDeleted tinyint NOT NULL DEFAULT 0, name varchar(200) NOT NULL, icon varchar(64) NULL, description varchar(300) NULL, habitId varchar(36) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE users (id varchar(36) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), isDeleted tinyint NOT NULL DEFAULT 0, email varchar(320) NOT NULL, name varchar(64) NOT NULL, password varchar(320) NULL, isRegisteredWithGoogle tinyint NOT NULL DEFAULT 0, phone varchar(64) NOT NULL, avatar varchar(200) NOT NULL, wallet varchar(64) NOT NULL, refererCode varchar(64) NOT NULL, referBy varchar(64) NOT NULL, point decimal(3,2) NOT NULL, exp int NOT NULL DEFAULT '0', level int NOT NULL DEFAULT '1', gender enum ('male', 'female', 'other', 'nonBinary') NOT NULL, old int NOT NULL, height decimal(3,2) NOT NULL, weight decimal(3,2) NOT NULL, UNIQUE INDEX IDX_62125893bc1e5ee43b4295621a (refererCode), PRIMARY KEY (id)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE minings (id varchar(36) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), isDeleted tinyint NOT NULL DEFAULT 0, consumerId varchar(36) NOT NULL, startDate datetime NOT NULL, endDate datetime NOT NULL, point decimal(3,2) NOT NULL, status enum ('pending', 'finished') NOT NULL DEFAULT 'pending', userId varchar(36) NULL, PRIMARY KEY (id)) ENGINE=InnoDB`,
    )

    //feedback of user
    await queryRunner.query(
      `CREATE TABLE feedbacks (id varchar(36) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), isDeleted tinyint NOT NULL DEFAULT 0, consumerId varchar(36) NOT NULL, content varchar(300) NOT NULL, name varchar(300) NOT NULL, status enum ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending', PRIMARY KEY (id)) ENGINE=InnoDB`,
    )

    //version
    await queryRunner.query(
      `CREATE TABLE versions (id varchar(36) NOT NULL, createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), isDeleted tinyint NOT NULL DEFAULT 0, version varchar(10) NOT NULL, platform enum ('android', 'ios') NOT NULL, url varchar(300) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB`,
    )

    //translation
    await queryRunner.query(
      `CREATE TABLE translations (id varchar(36) NOT NULL, table_name VARCHAR(255) NOT NULL, record_id varchar(36) NOT NULL, language_code VARCHAR(10) NOT NULL, translation TEXT NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB`,
    )

    await queryRunner.query(
      `ALTER TABLE user_habits ADD CONSTRAINT FK_0b7d751fc3a1337bc51088a6ac0 FOREIGN KEY (habitId) REFERENCES health_topic_habits(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE health_topic_habits ADD CONSTRAINT FK_b5d2e300156fab060b7efb089a0 FOREIGN KEY (topicId) REFERENCES health_topics(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE health_topic_habit_task_histories ADD CONSTRAINT FK_b47b49edcc4ecaf99d4b8631300 FOREIGN KEY (tasksId) REFERENCES health_topic_habit_tasks(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE health_topic_habit_tasks ADD CONSTRAINT FK_dc3da01ec653a9f6c1b4d1cc3db FOREIGN KEY (habitId) REFERENCES health_topic_habits(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE minings ADD CONSTRAINT FK_241db6da944524f8bc56f5e6814 FOREIGN KEY (userId) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE minings DROP FOREIGN KEY FK_241db6da944524f8bc56f5e6814`,
    )
    await queryRunner.query(
      `ALTER TABLE health_topic_habit_tasks DROP FOREIGN KEY FK_dc3da01ec653a9f6c1b4d1cc3db`,
    )
    await queryRunner.query(
      `ALTER TABLE health_topic_habit_task_histories DROP FOREIGN KEY FK_b47b49edcc4ecaf99d4b8631300`,
    )
    await queryRunner.query(
      `ALTER TABLE health_topic_habits DROP FOREIGN KEY FK_b5d2e300156fab060b7efb089a0`,
    )
    await queryRunner.query(
      `ALTER TABLE user_habits DROP FOREIGN KEY FK_0b7d751fc3a1337bc51088a6ac0`,
    )
    await queryRunner.query(`DROP TABLE minings`)
    await queryRunner.query(
      `DROP INDEX IDX_62125893bc1e5ee43b4295621a ON users`,
    )
    await queryRunner.query(`DROP TABLE users`)
    await queryRunner.query(`DROP TABLE health_topic_habit_tasks`)
    await queryRunner.query(`DROP TABLE health_topic_habit_task_histories`)
    await queryRunner.query(`DROP TABLE health_topic_habits`)
    await queryRunner.query(
      `DROP INDEX REL_0b7d751fc3a1337bc51088a6ac ON user_habits`,
    )
    await queryRunner.query(`DROP TABLE user_habits`)
    await queryRunner.query(`DROP TABLE health_topics`)
    await queryRunner.query(`DROP TABLE configs`)
  }
}
