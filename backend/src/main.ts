import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { seed } from './fixtures';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        console.log('Validation errors:', errors);
        return new BadRequestException({ error: 'Something went wrong...' });
      },
    }),
  );

  app.use(express.static('public'));
  app.use(express.json());
  app.use(cors({ origin: ['http://localhost:3000', 'http://192.168.1.69:3000'], credentials: true }));
  app.use(cookieParser());
  await app.listen(9000, '0.0.0.0');
  await seed();
}
bootstrap();
