import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './currency.entity';
import { CreateCurrencyDto } from './createCurrency.dto';
import { UpdateCurrencyDto } from './updateCurrency.dto';
import { RedisService } from 'src/common/redis/redis.service';

const CURRENCIES_CACHE_KEY: string = `all_currencies`;

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private currenciesRepository: Repository<Currency>,
    private readonly redisService: RedisService,
  ) {}

  async getAllCurrencies(): Promise<Currency[]> {
    const cachedCurrencies: string = await this.redisService.getValue(CURRENCIES_CACHE_KEY);

    if (cachedCurrencies) {
      return JSON.parse(cachedCurrencies);
    }

    const allCurrencies: Currency[] = await this.currenciesRepository.find();
    if (allCurrencies.length) {
      await this.redisService.setValue(CURRENCIES_CACHE_KEY, JSON.stringify(allCurrencies), 86400); // 1day
    }
    return allCurrencies;
  }

  async getCurrencyById(id: number): Promise<Currency> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const currency = await this.currenciesRepository.findOneBy({ id });
    if (!currency) {
      throw new NotFoundException({ error: 'Currency not found!' });
    }

    return currency;
  }

  async createNewCurrency(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    await this.redisService.deleteValue(CURRENCIES_CACHE_KEY);
    return this.currenciesRepository.save(createCurrencyDto);
  }

  async deleteCurrencyById(id: number): Promise<Currency> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const currency = await this.currenciesRepository.findOneBy({ id });
    if (!currency) {
      throw new NotFoundException({ error: 'Currency not found!' });
    }

    await this.currenciesRepository.delete(id);
    return currency;
  }

  async updateCurrencyById(id: number, updateCurrencyDto: UpdateCurrencyDto): Promise<Currency> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const currency = await this.currenciesRepository.findOneBy({ id });
    if (!currency) {
      throw new NotFoundException({ error: 'Currency not found!' });
    }

    const isUpdated = this.verifyChanges(currency, updateCurrencyDto);
    if (!isUpdated) {
      throw new BadRequestException({ error: 'No changes were made!' });
    }

    Object.assign(currency, updateCurrencyDto);
    const updatedFinanceCategory = await this.currenciesRepository.save(currency);
    return updatedFinanceCategory;
  }

  verifyChanges(currency: Currency, newCurrency: UpdateCurrencyDto): boolean {
    return (
      (newCurrency.name && newCurrency.name !== currency.name) ||
      (newCurrency.symbol && newCurrency.symbol !== currency.symbol) ||
      (newCurrency.code && newCurrency.code !== currency.code)
    );
  }
}
