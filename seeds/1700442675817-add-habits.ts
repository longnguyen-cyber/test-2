/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { HealthTopic } from 'src/domain/entities';

dotenv.config({ path: '../.env' });

const HABIT_FILE_PATH = './habits.json';

export class AddHabits1700442675817 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const data = fs.readFileSync(path.resolve(__dirname, HABIT_FILE_PATH));

    const topics: HealthTopic[] = JSON.parse(data.toString());
    const topicRepo = queryRunner.manager.getRepository(HealthTopic);

    await topicRepo.save(topics);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const topicRepo = queryRunner.manager.getRepository(HealthTopic);
    topicRepo.delete({});
  }
}
