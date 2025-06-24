import { Migration } from '@mikro-orm/migrations';

export class Migration20250624072119 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`users\` modify \`created_at\` datetime not null, modify \`updated_at\` datetime not null, modify \`deleted_at\` datetime;`);

    this.addSql(`alter table \`userEvents\` modify \`created_at\` datetime not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`users\` modify \`created_at\` varchar(255) not null, modify \`updated_at\` varchar(255) not null, modify \`deleted_at\` varchar(255);`);

    this.addSql(`alter table \`userEvents\` modify \`created_at\` varchar(255) not null;`);
  }

}
