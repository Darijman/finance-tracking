import { AppDataSource } from 'src/data.source';
import { seedRoles } from './roles.fixture';
import { seedCurrencies } from './currencies.fixture';
import { seedFinanceCategories } from './financeCategories.fixture';
import { seedUsers } from './users.fixture';

export async function seed() {
  if (!AppDataSource.isInitialized) {
    return await AppDataSource.initialize();
  }
  console.log('🔗 Database connected');

  try {
    await seedRoles(AppDataSource);
    await seedCurrencies(AppDataSource);
    await seedUsers(AppDataSource);
    await seedFinanceCategories(AppDataSource);
  } catch (err) {
    console.error('❌ Seeding failed', err);
  } finally {
    await AppDataSource.destroy();
    console.log('🌱 Seeding complete');
  }
}

seed();
