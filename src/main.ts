import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Habilitar la validación global
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,  // Elimina propiedades no definidas en los DTO
      forbidNonWhitelisted: true,  // Lanza una excepción si se envían propiedades no válidas
      transform: true,  // Transforma los tipos de datos según el DTO
    }));
  
  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5173',  // Permite solicitudes desde tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Si tu API utiliza cookies o autenticación con credenciales
  });
  
  await app.listen(3000);
}
bootstrap();
