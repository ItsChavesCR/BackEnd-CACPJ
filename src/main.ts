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
      'https://front-end-cacpj.vercel.app', 
      'https://logkw4oos484g4kg8o4k4swk.cacpj.online',
      'https://www.cacpj.online'
      
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(3000);
}

bootstrap(); // Fixed function name (with lowercase 'b')