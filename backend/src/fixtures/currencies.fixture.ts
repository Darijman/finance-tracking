import { DataSource } from 'typeorm';
import { Currency } from 'src/currencies/currency.entity';

interface ICurrency {
  name: string;
  symbol: string;
  code: string;
  flag: string;
}

const currenciesToCreate: ICurrency[] = [
  { name: 'US Dollar', symbol: '$', code: 'USD', flag: '🇺🇸' },
  { name: 'Euro', symbol: '€', code: 'EUR', flag: '🇪🇺' },
  { name: 'Japanese Yen', symbol: '¥', code: 'JPY', flag: '🇯🇵' },
];

export const seedCurrencies = async (dataSource: DataSource) => {
  const currenciesRepository = dataSource.getRepository(Currency);
  const currencies = await currenciesRepository.find();

  if (currencies.length === 0) {
    await currenciesRepository.save(currenciesToCreate);
    console.log('✅ Currencies seeded');
  } else {
    console.log('ℹ️ Currencies already exist!');
  }
};
