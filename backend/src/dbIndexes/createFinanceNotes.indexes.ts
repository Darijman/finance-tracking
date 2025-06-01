import { QueryRunner } from 'typeorm';
import { ensureIndexExists } from './ensureIndexExists';

export async function createFinanceNotesIndexes(queryRunner: QueryRunner) {
  const tableName: string = 'finance_notes';

  await ensureIndexExists(queryRunner, tableName, 'IDX_CATEGORY_ID', `CREATE INDEX IDX_CATEGORY_ID ON ${tableName}(categoryId)`);
  await ensureIndexExists(queryRunner, tableName, 'IDX_USER_ID', `CREATE INDEX IDX_USER_ID ON ${tableName}(userId)`);
  await ensureIndexExists(queryRunner, tableName, 'IDX_NOTE_DATE', `CREATE INDEX IDX_NOTE_DATE ON ${tableName}(noteDate)`);
  await ensureIndexExists(queryRunner, tableName, 'IDX_AMOUNT', `CREATE INDEX IDX_AMOUNT ON ${tableName}(amount)`);
  await ensureIndexExists(queryRunner, tableName, 'IDX_TYPE', `CREATE INDEX IDX_TYPE ON ${tableName}(type)`);
  await ensureIndexExists(
    queryRunner,
    tableName,
    'IDX_USER_AMOUNT_DATE',
    `CREATE INDEX IDX_USER_AMOUNT_DATE ON ${tableName}(userId, amount, noteDate)`,
  );
  await ensureIndexExists(
    queryRunner,
    tableName,
    'IDX_USER_TYPE_DATE',
    `CREATE INDEX IDX_USER_TYPE_DATE ON ${tableName}(userId, type, noteDate)`,
  );
  await ensureIndexExists(
    queryRunner,
    tableName,
    'IDX_USER_TYPE_AMOUNT_DATE',
    `CREATE INDEX IDX_USER_TYPE_AMOUNT_DATE ON ${tableName}(userId, type, amount, noteDate)`,
  );
  await ensureIndexExists(
    queryRunner,
    tableName,
    'IDX_USER_CATEGORY_DATE',
    `CREATE INDEX IDX_USER_CATEGORY_DATE ON ${tableName}(userId, categoryId, noteDate)`,
  );
  await ensureIndexExists(
    queryRunner,
    tableName,
    'IDX_USER_TYPE_CATEGORY_AMOUNT_DATE',
    `CREATE INDEX IDX_USER_TYPE_CATEGORY_AMOUNT_DATE ON ${tableName}(userId, type, categoryId, amount, noteDate)`,
  );
  await ensureIndexExists(
    queryRunner,
    tableName,
    'IDX_USER_ID_DATE_DESC',
    `CREATE INDEX IDX_USER_ID_DATE_DESC ON ${tableName}(userId, noteDate DESC)`,
  );
}
