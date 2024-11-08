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
    origin: ['http://localhost:5173', 'https://front-end-cacpj.vercel.app'],  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  
  });
  
  await app.listen(3000);
}
bootstrap();
