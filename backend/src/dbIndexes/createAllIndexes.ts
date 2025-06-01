import { DataSource } from 'typeorm';
import { createFinanceNotesIndexes } from './createFinanceNotes.indexes';

export async function createAllIndexes(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await createFinanceNotesIndexes(queryRunner);
  } finally {
    await queryRunner.release();
  }
}
