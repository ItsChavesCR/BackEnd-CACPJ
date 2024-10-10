/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../loginEntities/login.entity';
import { LoginDto } from '../loginDto/login.dto';
import { ChangePasswordDto } from '../loginDto/change-password.dto';


@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>, 
  ) {}

  async validateUser(area: string, password: string): Promise<any> {
    // Aquí usamos findOne en vez de findByArea
    const user = await this.userRepository.findOne({ where: { area } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { area, password } = loginDto;
    const user = await this.validateUser(area, password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { username: user.area, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;


    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }


    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('La contraseña actual no es correcta');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException('La nueva contraseña no puede ser igual a la actual');
    }    


    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Contraseña cambiada con éxito' };
  }
}
