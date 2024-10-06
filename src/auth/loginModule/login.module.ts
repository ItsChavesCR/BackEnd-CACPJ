import { Module } from '@nestjs/common';
import { LoginService } from '../loginService/login.service';
import { LoginController } from '../loginController/login.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../loginEntities/login.entity';
import { JwtStrategy } from '../strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule,
    JwtModule.register({
      secret: 'secretKey', // Cambia 'secretKey' por algo más seguro
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [LoginService, JwtStrategy],
  controllers: [LoginController],
})
export class LoginModule {}
