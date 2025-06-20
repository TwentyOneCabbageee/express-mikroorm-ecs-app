import { Collection, Entity, Index, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { UsersEntity } from './UsersEntity';
import { NotificationsEntity } from './NotificationsEntity';
import { UserEventsEntity } from './UserEventsEntity';

@Entity({tableName : 'events'})
export class EventsEntity {
    @PrimaryKey({ type: 'uuid' })
    id!: string;

    @OneToMany(() => UserEventsEntity, userEvent => userEvent.eventId)
    userEvents = new Collection<UserEventsEntity>(this);

    @OneToMany(() => NotificationsEntity, notificationsEntity => notificationsEntity.eventId)
    notifications = new Collection<UserEventsEntity>(this);

    @Property()
    @Index()
    name!: string;

    @Property()
    description!: string;

    @Property()
    frequency!: string;
}