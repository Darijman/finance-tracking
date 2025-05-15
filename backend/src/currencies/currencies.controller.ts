import { Controller, Get, Post, Delete, Put, Body, Param, UseGuards } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './createCurrency.dto';
import { UpdateCurrencyDto } from './updateCurrency.dto';
import { Currency } from './currency.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Admin, Public } from 'src/auth/auth.decorators';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllCurrencies(): Promise<Currency[]> {
    return await this.currenciesService.getAllCurrencies();
  }

  @Public()
  // @Admin()
  @Post()
  async createNewCurrency(@Body() createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    return await this.currenciesService.createNewCurrency(createCurrencyDto);
  }

  @Admin()
  @Get(':id')
  async getCurrencyById(@Param('id') id: number): Promise<Currency> {
    return await this.currenciesService.getCurrencyById(id);
  }

  @Admin()
  @Delete(':id')
  async deleteCurrencyById(@Param('id') id: number): Promise<Currency> {
    return await this.currenciesService.deleteCurrencyById(id);
  }

  @Admin()
  @Put(':id')
  async updateCurrencyById(@Param('id') id: number, @Body() updateCurrencyDto: UpdateCurrencyDto): Promise<Currency> {
    return await this.currenciesService.updateCurrencyById(id, updateCurrencyDto);
  }
}
