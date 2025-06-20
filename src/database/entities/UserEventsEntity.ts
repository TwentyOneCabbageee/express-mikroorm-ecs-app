import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UsersEntity } from './UsersEntity';
import { EventsEntity } from './EventsEntity';

@Entity({tableName : 'usersEvents'})
export class UserEventsEntity {
    @PrimaryKey({ type: 'uuid' })
    id!: string;

    @ManyToOne(() => UsersEntity, { nullable: false })
    userId!: string;

    @ManyToOne(() => EventsEntity, { nullable: false })
    eventId!: string;

    @Property()
    date!: Date;

    @Index()
    @Property()
    createdAt!: string;
}