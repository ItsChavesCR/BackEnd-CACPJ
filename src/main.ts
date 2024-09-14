import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5173',  // Permite solicitudes desde tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Si tu API utiliza cookies o autenticación con credenciales
  });
  
  await app.listen(3000);
}
bootstrap();
