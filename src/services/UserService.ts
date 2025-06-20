import { CreateUserRequestType, GetUserRequestType, GetUserResponseType, UpdateUserRequestType } from "types/UserTypes";
import { MikroORM, wrap } from '@mikro-orm/core';
import { UsersEntity } from '../database/entities/UsersEntity';
import { v4 as uuidv4 } from 'uuid';
import { UserEventsEntity } from "../database/entities/UserEventsEntity";
import { EventsEntity } from "../database/entities/EventsEntity";

export class UserService {
    constructor(
        private orm: MikroORM
    ) {} // Inject ORM instead of em

    async getUserById(userId:string):Promise<GetUserResponseType>{
        const entityManager = this.orm.em.fork();  
        const user = await entityManager.findOne(
            UsersEntity, 
            { id: userId, deletedAt: null },
            { populate: ['userEvents.eventId'] }
        );

        if(!user) {
            throw ({
                code: 404,
                message:"User not found"
            });
        }

        return {
            name: `${user.firstname} ${user.lastname}`,
            birthdate: user.userEvents.toString(),
            location: user.address,
        }
    }

    async createUser(user:CreateUserRequestType) {
        const entityManager = this.orm.em.fork();  
        
        const userid = uuidv4();
        await entityManager.insert(UsersEntity, {
            id: userid,
            firstname: user.firstName,
            lastname: user.lastName,
            // birthdate: new Date(user.birthdate).toISOString().slice(0, 10),
            address: user.address,
            timezone: user.timezone,
            createdAt: new Date().toISOString().slice(0, 10),
            updatedAt: new Date().toISOString().slice(0, 10)
        });

        const birthdayEvent = await entityManager.findOne(
            EventsEntity, 
            { name: 'birthday' },
        );

        if (!birthdayEvent) {
            throw ({
                code: 404,
                message:"Birthday event not found"
            });
        }

        const userEventsId = uuidv4();
        await entityManager.insert(UserEventsEntity, {
            id: userEventsId,
            userId: userid,
            eventId: birthdayEvent.id,   
            date: new Date(user.birthdate).toISOString().slice(0, 10),
            createdAt: new Date().toISOString().slice(0, 10),
        });
    }

    async deleteUser(userId:string) {
        const entityManager = this.orm.em.fork();  
        
        const user = await entityManager.findOne(UsersEntity, { id: userId });

        if(!user) {
            throw ({
                code: 404,
                message:"User not found"
            });
        }

        user.deletedAt = new Date().toISOString().slice(0, 10);
        await entityManager.persistAndFlush(user);
    }


    async updateUser(request:UpdateUserRequestType) {
        const entityManager = this.orm.em.fork();  
        
        if(!request.firstName && !request.lastName && !request.birthdate && !request.address && !request.timezone) {
            throw ({
                code: 422,
                message:"Missing fields to update. At least one field is required."
            });
        }

        console.log("Updating User", request);

        const user = await entityManager.findOne(UsersEntity, { id: request.userId,deletedAt: null });

        if(!user) {
            throw ({
                code: 404,
                message:"User not found"
            });
        }

        wrap(user).assign({
            ...(request.firstName !== undefined && { firstname: request.firstName }),
            ...(request.lastName !== undefined && { lastname: request.lastName }),
            ...(request.address !== undefined && { address: request.address }),
            ...(request.timezone !== undefined && { timezone: request.timezone }),
        });
        await entityManager.flush();

        if(request.birthdate){
            const userEvent = await entityManager.findOne(UserEventsEntity, { userId: request.userId });

            if(!userEvent) {
                throw ({
                    code: 404,
                    message:"User event not found"
                });
            }

            wrap(userEvent).assign({
                date: new Date(request.birthdate).toISOString().slice(0, 10)
            });
            await entityManager.flush();
        }

    }
}

