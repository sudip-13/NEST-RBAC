import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as path from 'path';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'dbConfig.dev',
  (): MysqlConnectionOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3307,
    username: process.env.DB_USER || 'roo',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nest_a',
    entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
);
