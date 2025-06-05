/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../loginEntities/login.entity';
import { LoginDto } from '../loginDto/login.dto';
import { ChangePasswordDto } from '../loginDto/change-password.dto';
import { ChangePasswordRecoveryDto } from '../loginDto/change-password-recovery.dto'; // DTO para el cambio con código de recuperación
import * as nodemailer from 'nodemailer';  // Para enviar correos

@Injectable()
export class LoginService {
  private recoveryCodes: Map<string, string> = new Map();  // Almacena temporalmente los códigos de recuperación

  // Usuario hardcodeado para fallback
  private readonly HARDCODED_USER = {
    area: 'admin_fallback',
    password: 'Tn8$KbR9&WqZ3vYp',
    id: 'fallback-id',
  };

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
  ) {}

  // Configuración de Nodemailer para enviar correos
  private transporter = nodemailer.createTransport({
    service: 'gmail',  // Gmail como proveedor de correo
    auth: {
      user: process.env.EMAIL_USER,  // Usando la variable de entorno con el nuevo correo
      pass: process.env.EMAIL_PASS,  // Usando la variable de entorno con la nueva contraseña
    },
  });

  // Enviar código de recuperación por correo electrónico
  async sendRecoveryCode(emailOrPhone: string, method: 'email') {
    const code = Math.floor(100000 + Math.random() * 900000).toString();  // Genera un código aleatorio de 6 dígitos
    this.recoveryCodes.set(emailOrPhone, code);  // Guardar el código temporalmente

    // Enviar código por correo electrónico
    const mailOptions = {
      from: '"Soporte CACPJ" <centroagricolajicaral@gmail.com>',
      to: emailOrPhone,
      subject: 'Código de Recuperación de Contraseña',
      text: `Tu código de recuperación es: ${code}`,
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`Código de recuperación enviado por correo: ${code}`);

    return { message: `Código enviado por ${method}` };
  }

  // Validar el código de recuperación
  async validateRecoveryCode(code: string): Promise<boolean> {
    const validCode = Array.from(this.recoveryCodes.values()).includes(code);
    if (!validCode) {
      throw new UnauthorizedException('Código inválido o ha expirado');
    }
    return true;
  }

  // Cambiar la contraseña utilizando el código de recuperación
  async changePasswordUsingCode(changePasswordDto: ChangePasswordRecoveryDto) {
    const { recoveryCode, newPassword, area } = changePasswordDto;

    // Verificamos que el código de recuperación sea válido
    const validCode = Array.from(this.recoveryCodes.values()).includes(recoveryCode);

    if (!validCode) {
      throw new UnauthorizedException('Código de recuperación no encontrado o ha expirado');
    }

    // Verificamos que el área ingresada existe en la base de datos
    const usuarioEncontrado = await this.userRepository.findOne({ where: { area } });

    if (!usuarioEncontrado) {
      throw new UnauthorizedException('Área no encontrada');
    }

    // Cambiar la contraseña del usuario encontrado
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    usuarioEncontrado.password = hashedPassword;
    await this.userRepository.save(usuarioEncontrado);

    // Eliminar el código de recuperación después del uso
    this.recoveryCodes.delete(recoveryCode);

    return { message: 'Contraseña cambiada exitosamente' };
  }

  // Método para validar un usuario con área y contraseña
  async validateUser(area: string, password: string): Promise<any> {
    // 1) Verificar primero el usuario hardcodeado
    if (area === this.HARDCODED_USER.area && password === this.HARDCODED_USER.password) {
      // Devolver un objeto similar al usuario de BD (sin el campo password)
      return {
        id: this.HARDCODED_USER.id,
        area: this.HARDCODED_USER.area,
      };
    }

    // 2) Validación normal contra la base de datos
    const user = await this.userRepository.findOne({ where: { area } });

    if (!user) {
      throw new UnauthorizedException('Área incorrecta');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }

    // Quitar la contraseña del objeto antes de retornarlo
    const { password: _, ...result } = user;
    return result;
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

  // Método para cambiar la contraseña (cuando el usuario está autenticado)
  async changePassword(area: string, password: string, newPassword: string) {
    // Evitar cambio de contraseña del usuario hardcodeado
    if (area === this.HARDCODED_USER.area) {
      throw new UnauthorizedException('No es posible cambiar la contraseña de este usuario');
    }

    // Buscar al usuario por el área
    const user = await this.userRepository.findOne({ where: { area } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar que la contraseña actual ingresada coincide con la almacenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('La contraseña actual no es correcta');
    }

    // Hashear la nueva contraseña y actualizar el registro
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Contraseña cambiada con éxito' };
  }

  // Método para obtener todas las áreas de los usuarios
  async getAllAreas() {
    const users = await this.userRepository.find({ select: ['area'] });
    return users;
  }
}
