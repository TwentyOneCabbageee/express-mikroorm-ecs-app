import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './config/mikro-orm.config';
import app from './app';
import cron from 'node-cron';
import { NotificationService } from './services/NotificationService';
import { Router } from 'express';
import { setRoutes,initRoutes } from './routes/index';

const startServer = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().createMigration();
    await orm.getMigrator().up();

    // TODO: eventbridge/lambda
    const notificationService = new NotificationService();
    // notificationService.greet(); //delete for testing purposes

    cron.schedule('0 * * * *', () => {
        notificationService.greet();
    });


    await initRoutes(orm);
    const router = Router();
    setRoutes(router);
    
    app.use(router);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer().catch(err => {
    console.error('Error starting the server:', err);
    process.exit(1);
});

