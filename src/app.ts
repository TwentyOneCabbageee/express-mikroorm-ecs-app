import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './config/mikro-orm.config';
import { MikroOrmInitError } from './types/index';

const app = express();

// Middleware
app.use(express.json());

MikroORM.init(mikroOrmConfig)
  .then((_orm) => {
    console.log('Connected to the database');
  })
  .catch((err: MikroOrmInitError) => {
    console.error('Database connection error:', err);
  });

// Export the app instance
export default app;