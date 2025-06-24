import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { UserEventsEntity } from './UserEventsEntity';
import { v4 as uuidv4 } from 'uuid';
import { NotificationsEntity } from './NotificationsEntity';

@Entity({tableName : 'users'})
export class UsersEntity {
    @PrimaryKey({ type: 'uuid' })
    id: string = uuidv4();

    @OneToMany(() => UserEventsEntity, userEvent => userEvent.user)
    userEvents = new Collection<UserEventsEntity>(this);

    @Property()
    firstname!: string;

    @Property()
    lastname!: string;

    @Property()
    address!: string;

    @Property()
    timezone?: string;

    @Property()
    createdAt?: Date;

    @Property()
    updatedAt?: Date; 

    @Property({ nullable: true })
    deletedAt?: Date;
}