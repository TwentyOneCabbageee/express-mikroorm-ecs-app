import { Migration } from '@mikro-orm/migrations';

export class Migration20250624145816 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`notifications\` modify \`created_at\` datetime not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`notifications\` modify \`created_at\` varchar(255) not null;`);
  }

}
