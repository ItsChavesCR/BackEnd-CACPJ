/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar la validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://www.cacpj.online',
      'https://www.cacjicaral.com',
      'https://cacjicaral.com'
      
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const port = Number.parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);
}

bootstrap(); // Fixed function name (with lowercase 'b')