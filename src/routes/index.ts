import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService'; 
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../config/mikro-orm.config';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { CreateUserRequestType, UpdateUserRequestType } from '../types/UserTypes';

let userController: UserController;

export async function initRoutes(orm: MikroORM) {
    const userService = new UserService(orm);
    userController = new UserController(userService);
}

export function setRoutes(app: Router) {
    app.get('/user/:userId', userController.getUserById.bind(userController));
    app.post('/user', validationMiddleware({ body: CreateUserRequestType}),(req, res) => {
        userController.createUser(req.body, res);
    });
    app.delete('/user/:userId', userController.deleteUser.bind(userController));
    app.put('/user/:userId', validationMiddleware({ body: UpdateUserRequestType}),(req, res) => {
        userController.updateUser({...req.body,...req.params}, res);
    });
}