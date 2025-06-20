import { Migration } from '@mikro-orm/migrations';

export class Migration20250620051124 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`events\` (\`id\` varchar(36) not null, \`name\` varchar(255) not null, \`description\` varchar(255) not null, \`frequency\` varchar(255) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`events\` add index \`events_name_index\`(\`name\`);`);

    this.addSql(`create table \`users\` (\`id\` varchar(36) not null, \`firstname\` varchar(255) not null, \`lastname\` varchar(255) not null, \`address\` varchar(255) not null, \`timezone\` varchar(255) not null, \`created_at\` varchar(255) not null, \`updated_at\` varchar(255) not null, \`deleted_at\` varchar(255) null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`usersEvents\` (\`id\` varchar(36) not null, \`user_id_id\` varchar(36) not null, \`event_id_id\` varchar(36) not null, \`date\` datetime not null, \`created_at\` varchar(255) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`usersEvents\` add index \`usersEvents_user_id_id_index\`(\`user_id_id\`);`);
    this.addSql(`alter table \`usersEvents\` add index \`usersEvents_event_id_id_index\`(\`event_id_id\`);`);
    this.addSql(`alter table \`usersEvents\` add index \`usersEvents_created_at_index\`(\`created_at\`);`);

    this.addSql(`create table \`notifications\` (\`id\` varchar(36) not null, \`event_id_id\` varchar(36) not null, \`user_id_id\` varchar(36) not null, \`created_at\` varchar(255) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`notifications\` add index \`notifications_event_id_id_index\`(\`event_id_id\`);`);
    this.addSql(`alter table \`notifications\` add index \`notifications_user_id_id_index\`(\`user_id_id\`);`);

    this.addSql(`alter table \`usersEvents\` add constraint \`usersEvents_user_id_id_foreign\` foreign key (\`user_id_id\`) references \`users\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`usersEvents\` add constraint \`usersEvents_event_id_id_foreign\` foreign key (\`event_id_id\`) references \`events\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`notifications\` add constraint \`notifications_event_id_id_foreign\` foreign key (\`event_id_id\`) references \`events\` (\`id\`) on update cascade;`);
    this.addSql(`alter table \`notifications\` add constraint \`notifications_user_id_id_foreign\` foreign key (\`user_id_id\`) references \`users\` (\`id\`) on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`usersEvents\` drop foreign key \`usersEvents_event_id_id_foreign\`;`);

    this.addSql(`alter table \`notifications\` drop foreign key \`notifications_event_id_id_foreign\`;`);

    this.addSql(`alter table \`usersEvents\` drop foreign key \`usersEvents_user_id_id_foreign\`;`);

    this.addSql(`alter table \`notifications\` drop foreign key \`notifications_user_id_id_foreign\`;`);

    this.addSql(`drop table if exists \`events\`;`);

    this.addSql(`drop table if exists \`users\`;`);

    this.addSql(`drop table if exists \`usersEvents\`;`);

    this.addSql(`drop table if exists \`notifications\`;`);
  }

}
