import dbConfig from '../config/db.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeder, SeederOptions } from 'typeorm-extension';
import { MainSeeder } from './main.seeder';
import UserFactory from './user.factory';
import RoleFactory from './role.factory';
import PermissionFactory from './permission.factory';
import * as dotenv from 'dotenv';
dotenv.config();
const options: DataSourceOptions & SeederOptions = {
  ...dbConfig(),
  factories: [UserFactory, PermissionFactory, RoleFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);
dataSource
  .initialize()
  .then(async () => {
    await dataSource.synchronize(true);
    // Pass the MainSeeder as the second argument to runSeeder
    await runSeeder(dataSource, MainSeeder);
  })
  .catch((error) => {
    console.error('Error during data source initialization:', error);
  })
  .finally(() => {
    process.exit();
  });
