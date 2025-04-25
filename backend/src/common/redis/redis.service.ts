import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  private isAvailable = false;

  constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
      lazyConnect: true,
      retryStrategy: () => null,
    });

    this.redis
      .connect()
      .then(() => {
        this.isAvailable = true;
        console.log('[Redis] Connected successfully');
      })
      .catch((err) => {
        console.log('[Redis connect error]', err.message);
      });

    this.redis.on('error', (err) => {
      this.isAvailable = false;
      console.error('[Redis error]', err.message);
    });
  }

  private async safeExecute<T>(fn: () => Promise<T>, operation: string): Promise<T | null> {
    if (!this.isAvailable) {
      return null;
    }

    try {
      return await fn();
    } catch (err) {
      console.log(`[Redis ${operation} error]`, err.message);
      return null;
    }
  }

  async getValue(key: string): Promise<string | null> {
    return this.safeExecute(() => this.redis.get(key), 'getValue');
  }

  async setValue(key: string, value: string, ttl: number): Promise<void> {
    await this.safeExecute(() => this.redis.set(key, value, 'EX', ttl), 'setValue');
  }

  async deleteValue(key: string): Promise<boolean> {
    const result = await this.safeExecute(() => this.redis.del(key), 'deleteValue');
    return result ? result > 0 : false;
  }
}
