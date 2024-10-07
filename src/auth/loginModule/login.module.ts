/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginController } from '../loginController/login.controller';
import { LoginService } from '../loginService/login.service';
import { UsuarioRepository } from '../usuario.repository';
import { Usuario } from '../loginEntities/login.entity';
import { JwtStrategy } from '../strategy/jwt.strategy';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'mySecretKey', // Usa una variable de entorno para esto en producción
      signOptions: { expiresIn: '1h' },  // El token expirará en 1 hora
    }),
    TypeOrmModule.forFeature([UsuarioRepository, Usuario]), // Registramos el repositorio y la entidad
  ],
  providers: [LoginService, JwtStrategy],
  controllers: [LoginController],
})
export class LoginModule {}
