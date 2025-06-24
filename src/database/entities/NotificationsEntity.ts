import { Entity, Index, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { UserEventsEntity } from './UserEventsEntity';

@Entity({tableName : 'notifications'})
export class NotificationsEntity {
    @PrimaryKey({ type: 'uuid' })
    id!: string;

    @ManyToOne(() => UserEventsEntity, { nullable: false })
    userEventId!: string;

    @Property()
    createdAt!: Date;
}