import { registerAs } from '@nestjs/config';
import { SeimNamingStrategy } from 'src/common/core';

export default registerAs('db', () => ({
  type: process.env.ORM_CONNECTION,
  host: process.env.ORM_HOST,
  port: Number(process.env.ORM_PORT),
  username: process.env.ORM_USERNAME,
  password: process.env.ORM_PASSWORD,
  database: process.env.ORM_DB,
  timezone: 'Z',
  logging: process.env.ORM_LOGGING === 'true' ? true : ['error'],
  autoLoadEntities: true,
  keepConnectionAlive: true,
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  namingStrategy: new SeimNamingStrategy(),
  extra: {
    connectionLimit: parseInt(process.env.ORM_CONNECTION_LIMIT || '10', 10),
  },
}));
