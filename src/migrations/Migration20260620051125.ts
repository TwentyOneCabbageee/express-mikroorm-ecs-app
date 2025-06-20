import { Migration } from '@mikro-orm/migrations';
import { v4 as uuidv4 } from 'uuid';

export class Migration20250620034250 extends Migration {
  override async up(): Promise<void> {
    const uuid = uuidv4();
    this.addSql(`insert into events (id, name, description, frequency) values ('${uuid}', 'birthday', 'User birthday event', 'yearly');`);
  }

  override async down(): Promise<void> {
    this.addSql(`delete from events where name = 'birthday';`);
  }

}
