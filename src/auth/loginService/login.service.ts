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

  // Método para validar un usuario con área y contraseña
  async validateUser(area: string, password: string): Promise<any> {
    // Buscar el usuario por área exactamente como se pasa
    const user = await this.userRepository.findOne({ where: { area } });

    if (!user) {
      throw new UnauthorizedException('Área incorrecta'); // Lanzar excepción si el área no coincide
    }

    // Validación estricta del área: comparar sin espacios ni diferencias de mayúsculas/minúsculas
    if (user.area.trim().toLowerCase() !== area.trim().toLowerCase()) {
      throw new UnauthorizedException('Área incorrecta'); // Si el área no coincide exactamente, retornar null
    }

    // Verificar la contraseña
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('La contraseña es incorrecta'); // Si la contraseña no coincide, retornar null
    }

    // Eliminamos el campo password del objeto retornado
    const { password: _, ...result } = user;
    return result; // Retornar el usuario si todo es válido
  }

  // Método para el login
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

  // Método para cambiar la contraseña
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

  // Método para obtener todas las áreas de los usuarios
  async getAllAreas() {
    const users = await this.userRepository.find({ select: ['area'] }); // Solo seleccionamos las áreas
    return users;
  }
}
