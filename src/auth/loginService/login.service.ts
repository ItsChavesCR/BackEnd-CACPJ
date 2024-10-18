/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../loginEntities/login.entity';
import { LoginDto } from '../loginDto/login.dto';
import { ChangePasswordDto } from '../loginDto/change-password.dto';
import * as nodemailer from 'nodemailer';  // Para enviar correos

@Injectable()
export class LoginService {
  private recoveryCodes: Map<string, string> = new Map();  // Almacena temporalmente los códigos de recuperación

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
  async sendRecoveryCode(emailOrPhone: string, method: 'email') {  // Solo 'email' ya que eliminamos 'sms'
    const code = Math.floor(100000 + Math.random() * 900000).toString();  // Genera un código aleatorio de 6 dígitos
    this.recoveryCodes.set(emailOrPhone, code);  // Guardar el código temporalmente

    // Enviar código por correo electrónico
    const mailOptions = {
      from: '"Soporte CACPJ" <centroagricolajicaral@gmail.com>',  // Usando el nuevo correo
      to: emailOrPhone,  // Enviar al correo ingresado por el usuario
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
  async changePasswordUsingCode(changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    // Buscar al usuario por el código de recuperación (currentPassword es en realidad el código de recuperación)
    const areaCorrespondiente = Array.from(this.recoveryCodes.entries()).find(([area, code]) => code === currentPassword);

    if (!areaCorrespondiente) {
      throw new UnauthorizedException('Código de recuperación no encontrado o ha expirado');
    }

    const [userArea] = areaCorrespondiente;  // Obtener el área del usuario a partir del código de recuperación

    const usuarioEncontrado = await this.userRepository.findOne({ where: { area: userArea } });

    if (!usuarioEncontrado) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Cambiar la contraseña del usuario encontrado
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    usuarioEncontrado.password = hashedPassword;
    await this.userRepository.save(usuarioEncontrado);

    this.recoveryCodes.delete(userArea);  // Eliminar el código utilizado
    return { message: 'Contraseña cambiada exitosamente' };
  }

  // Método para validar un usuario con área y contraseña
  async validateUser(area: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { area } });

    if (!user) {
      throw new UnauthorizedException('Área incorrecta');
    }

    if (user.area.trim().toLowerCase() !== area.trim().toLowerCase()) {
      throw new UnauthorizedException('Área incorrecta');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }

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
    const users = await this.userRepository.find({ select: ['area'] });
    return users;
  }
}
