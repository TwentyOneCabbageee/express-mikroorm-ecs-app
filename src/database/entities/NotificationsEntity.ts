import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UsersEntity } from './UsersEntity';
import { EventsEntity } from './EventsEntity';

@Entity({tableName : 'notifications'})
export class NotificationsEntity {
    @PrimaryKey({ type: 'uuid' })
    id!: string;

    @ManyToOne(() => EventsEntity, { nullable: false })
    eventId!: string;

    @ManyToOne(() => UsersEntity, { nullable: false })
    userId!: string;

    @Property()
    createdAt!: string;
}