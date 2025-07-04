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
            { 
                id: userId, 
                deletedAt: null, 
                userEvents: { event: { name: 'birthday' } }  
            },
            { 
               populate: ['$infer']
            }
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
            address: user.address,
            timezone: user.timezone,
            createdAt: new Date(),
            updatedAt: new Date()
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
            user: userid,
            event: birthdayEvent.id,
            date: new Date(user.birthdate).toISOString().slice(0, 10),
            createdAt: new Date(),
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

        user.deletedAt = new Date();
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

        request.firstName !== undefined && (user.firstname = request.firstName);
        request.lastName !== undefined && (user.lastname = request.lastName);
        request.address !== undefined && (user.address = request.address);
        request.timezone !== undefined && (user.timezone = request.timezone);

        await entityManager.flush();

        if(request.birthdate){
            const userEvent = await entityManager.findOne(UserEventsEntity, { user: request.userId });

            if(!userEvent) {
                throw ({
                    code: 404,
                    message:"User event not found"
                });
            }

            let date:Date = new Date(request.birthdate)
            date.setHours(0, 0, 0, 0); 
            userEvent.date = date

            await entityManager.flush();
        }

    }
}

