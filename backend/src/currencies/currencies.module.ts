import { forwardRef, Module } from '@nestjs/common';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './currency.entity';
import { UsersModule } from 'src/users/users.module';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Currency]), forwardRef(() => UsersModule), RedisModule],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
