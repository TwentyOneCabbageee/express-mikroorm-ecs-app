import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { UsersEntity } from '../database/entities/UsersEntity';
import dotenv from 'dotenv';
import { NotificationsEntity } from '../database/entities/NotificationsEntity';
import { EventsEntity } from '../database/entities/EventsEntity';
import { UserEventsEntity } from '../database/entities/UserEventsEntity';

dotenv.config();

export default {
  entities: [UsersEntity,NotificationsEntity,EventsEntity,UserEventsEntity],
  dbName: process.env.database_name,
  driver: MySqlDriver,
  user: process.env.database_user,
  password: process.env.database_password,
  host: process.env.database_host,
  port: parseInt(process.env.database_port!, 10),
  debug: process.env.database_debug, // set to false in production
} as Parameters<typeof MikroORM.init>[0];