import { DataSourceOptions } from 'typeorm'

import * as dotenv from 'dotenv'
import { SeimNamingStrategy } from 'src/common/core'

dotenv.config({ path: '../.env' })

const baseOptions = {
  type: process.env.ORM_CONNECTION || 'mysql',
  host: process.env.ORM_HOST,
  port: Number(process.env.ORM_PORT),
  username: process.env.ORM_USERNAME,
  password: process.env.ORM_PASSWORD,
  database: process.env.ORM_DB,
  timezone: 'Z',
  synchronize: false,
  dropSchema: false,
  entities: ['../src/**/*.entity.ts'],
  namingStrategy: new SeimNamingStrategy(),
}

const defaultOptions: DataSourceOptions = {
  ...baseOptions,
  type: 'mysql',
  migrationsRun: true,
  logging: true,
  migrationsTableName: '__migrations',
  migrations: ['../migrations/**/*.ts'],
}

const seedOptions: DataSourceOptions = {
  ...baseOptions,
  type: 'mysql',
  name: 'seed',
  migrationsRun: true,
  logging: true,
  migrationsTableName: '__seeds',
  migrations: ['../seeds/**/*.ts'],
}

export default { defaultOptions, seedOptions }
