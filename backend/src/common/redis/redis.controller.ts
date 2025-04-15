import { BadRequestException, Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('set')
  async setValue(@Body() data: { key: string; value: string; ttl: number }) {
    const { key, value, ttl } = data;
    await this.redisService.setValue(key, value, ttl);
    return { success: true };
  }

  @Get('get')
  async getValue(@Body() data: { key: string }) {
    const { key } = data;
    const value = await this.redisService.getValue(key);
    return value ? value : new BadRequestException({ error: 'No value found!' });
  }

  @Delete('delete')
  async deleteValue(@Body() data: { key: string }) {
    const { key } = data;
    const result = await this.redisService.deleteValue(key);
    if (!result) {
      throw new BadRequestException({ error: 'Key not found!' });
    }
    return { success: true };
  }
}
