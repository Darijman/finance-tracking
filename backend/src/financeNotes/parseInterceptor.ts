import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ParseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transformData(data)));
  }

  private transformData(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.transformData(item));
    } else if (data !== null && typeof data === 'object') {
      return Object.keys(data).reduce((acc, key) => {
        const value = data[key];

        if (value instanceof Date) {
          acc[key] = value;
        } else if ((key === 'id' && typeof value === 'string' && !isNaN(Number(value))) || key === 'amount') {
          acc[key] = Number(value);
        } else {
          acc[key] = this.transformData(value);
        }

        return acc;
      }, {} as any);
    }
    return data;
  }
}
