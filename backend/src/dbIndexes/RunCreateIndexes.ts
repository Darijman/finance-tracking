import { AppDataSource } from '../data.source';
import { createAllIndexes } from './createAllIndexes';

async function run() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  console.log('🔗 Database connected');

  await createAllIndexes(AppDataSource);

  await AppDataSource.destroy();
  console.log('✅ Index creation complete');
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Index creation failed', err);
    process.exit(1);
  });
