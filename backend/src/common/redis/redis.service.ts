import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async getValue(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  // ('EX' = In Seconds)
  async setValue(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttl);
  }

  async deleteValue(key: string): Promise<boolean> {
    const result = await this.redis.del(key);
    return result > 0;
  }
}
