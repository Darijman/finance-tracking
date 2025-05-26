import { DataSource } from 'typeorm';
import { FinanceCategory } from 'src/financeCategories/financeCategory.entity';

interface IFinanceCategory {
  name: string;
  image: string;
  userId?: number;
}

const financeCategoriesToCreate: IFinanceCategory[] = [
  { name: 'FOOD', image: 'food-icon-1747377078870.svg' },
  { name: 'CLOTHES', image: 'clothes-icon-1747377189851.svg' },
  { name: 'DIFFERENT', image: 'different-icon-1747377200793.svg' },
  { name: 'HEALTH', image: 'health-icon-1747377211188.svg' },
  { name: 'MOBILE', image: 'mobile-icon-1747377223083.svg' },
  { name: 'SPORT', image: 'sport-icon-1747377238548.svg' },
];

export const seedFinanceCategories = async (dataSource: DataSource) => {
  const financeCategoriesRepository = dataSource.getRepository(FinanceCategory);
  const financeCategories = await financeCategoriesRepository.find();

  if (financeCategories.length === 0) {
    await financeCategoriesRepository.save(financeCategoriesToCreate);
    console.log('✅ Finance-Categories seeded');
  } else {
    console.log('ℹ️ Finance-Categories already exist!');
  }
};
