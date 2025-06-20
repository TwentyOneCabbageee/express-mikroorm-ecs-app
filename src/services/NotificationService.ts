import { GetUserResponseType } from "types/UserTypes";
import { EntityManager, MikroORM, wrap } from '@mikro-orm/mysql';
import { UsersEntity } from '../database/entities/UsersEntity';
import { NotificationsEntity } from '../database/entities/NotificationsEntity';
import mikroOrmConfig from "../config/mikro-orm.config";
import axios from "axios";
import { eventNames } from "process";
import { v4 as uuidv4 } from 'uuid';
import { EventsEntity } from "../database/entities/EventsEntity";

export class NotificationService {
    private PROCESSING_IN_PROGRESS = false;
    private pipeHost:string | undefined;
    async greet():Promise<void>{
        if (this.PROCESSING_IN_PROGRESS) {
            console.log("Processing already in progress");
            return;
        }

        this.PROCESSING_IN_PROGRESS = true;

        this.pipeHost = process.env.pipeURL;// env

        if(!this.pipeHost) {
            console.error('Pipe URL is not defined in environment variables');  
            return;
        }

        const orm = await MikroORM.init(mikroOrmConfig);
        const entityManager = orm.em.fork();

        // TODO: separate MM-DD and year for faster fetching
        // TODO modify query to fetch from UsersEvents table

        

        const users:UsersEntity[] = await entityManager.getConnection().execute(`
            SELECT u.*
            FROM users u
            LEFT JOIN usersevents ue 
            ON ue.user_id_id = u.id 
            AND ue.event_id_id = (SELECT id FROM events WHERE name = 'birthday')
            LEFT JOIN notifications n 
            ON n.user_id_id = u.id 
            AND n.event_id_id = (SELECT id FROM events WHERE name = 'birthday')
            WHERE DATE_FORMAT(ue.date, '%m-%d') = DATE_FORMAT(
                    DATE(CONVERT_TZ(NOW(), @@session.time_zone, u.timezone)), '%m-%d'
                )
            AND HOUR(CONVERT_TZ(NOW(), @@session.time_zone, u.timezone)) = 13
            AND u.deleted_at IS NULL
            GROUP BY u.id
            HAVING MAX(n.created_at) IS NULL 
                OR YEAR(CONVERT_TZ(MAX(n.created_at), @@session.time_zone, u.timezone)) 
                    <= YEAR(CONVERT_TZ(NOW(), @@session.time_zone, u.timezone)) - 1;
        `);

        if (users.length <= 0) {
            this.PROCESSING_IN_PROGRESS = false;
            return;
        }

        let batchSize = 10;

        for (let i = 0; i < users.length; i += batchSize) {
            const userBatch = users.slice(i, i + batchSize)
            try {
                this.processUserNotifications(userBatch, entityManager);
            } catch (error) {
                console.error('Error processing user notification:', error);
            }
            
        }

        this.PROCESSING_IN_PROGRESS = false;
    } 

    private async processUserNotifications(users: UsersEntity[], entityManager:any) {
        const birthdayEvent = await entityManager.findOne(
            EventsEntity, 
            { name: 'birthday' },
        );
        await Promise.all(users.map(user => {
            const id = uuidv4();

            //TODO: SNS/SQS/lambda
            //add retry logic

            axios.post(this.pipeHost!, {message:`Hey, ${user.firstname} ${user.lastname} it's your birthday`}, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => {
                entityManager.insert(NotificationsEntity, {
                    id: id,
                    userId: user.id,
                    eventId: birthdayEvent.id,
                    createdAt: new Date().toISOString().slice(0, 10)
                });  
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.error('Axios error:', error.response);
                } else {
                    console.error('Unknown error:', error);
                }
            });
        })); 
    } 
}



