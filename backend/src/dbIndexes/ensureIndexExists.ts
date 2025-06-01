import { QueryRunner } from 'typeorm';

export async function ensureIndexExists(queryRunner: QueryRunner, tableName: string, indexName: string, createQuery: string) {
  const result = await queryRunner.query(
    `
      SELECT COUNT(*) as count FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name = ?
        AND index_name = ?
    `,
    [tableName, indexName],
  );

  if (Number(result[0].count) === 0) {
    console.log(`Creating index ${indexName} on ${tableName}...`);
    await queryRunner.query(createQuery);
  } else {
    console.log(`Index ${indexName} already exists on ${tableName}, skipping.`);
  }
}
