import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UsersEntity } from './UsersEntity';
import { EventsEntity } from './EventsEntity';

@Entity({tableName : 'userEvents'})
export class UserEventsEntity {
    @PrimaryKey({ type: 'uuid' })
    id!: string;

    @ManyToOne(() => UsersEntity, { nullable: false })
    user!: UsersEntity;

    @ManyToOne(() => EventsEntity, { nullable: false })
    event!: EventsEntity; 

    @Property()
    date!: Date;

    @Index()
    @Property()
    createdAt!: Date;
}