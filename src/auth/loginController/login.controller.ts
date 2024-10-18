/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Get, Put, Request, UnauthorizedException } from '@nestjs/common';
import { LoginService } from '../loginService/login.service';
import { LoginDto } from '../loginDto/login.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ChangePasswordDto } from '../loginDto/change-password.dto';
import { SendRecoveryCodeDto } from '../loginDto/send-recovery-code.dto';  // Para enviar código
import { ValidateCodeDto } from '../loginDto/validate-code.dto';  // Para validar el código

@Controller('auth')
export class LoginController {
  constructor(private readonly authService: LoginService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('protected')  // Esta es una ruta protegida
  @UseGuards(JwtAuthGuard)  // Aplicamos el guard para protegerla
  getProtectedResource() {
    return { message: 'Accediste a una ruta protegida!' };
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = req.user.sub; 
    return this.authService.changePassword(userId, changePasswordDto);
  }

  // Nuevo endpoint para obtener las áreas de los usuarios
  @Get('usuarios')
  async getAllAreas() {
    return this.authService.getAllAreas(); // Llama a un método en el servicio
  }

  // Enviar código de recuperación por correo
  @Post('send-recovery-code')
  async sendRecoveryCode(@Body() sendRecoveryCodeDto: SendRecoveryCodeDto) {
    return this.authService.sendRecoveryCode(
      sendRecoveryCodeDto.emailOrPhone, // El correo al que se envía el código
      'email' // Solo usamos "email" ahora
    );
  }

  // Validar el código de recuperación
  @Post('validate-recovery-code')
  async validateRecoveryCode(@Body() validateCodeDto: ValidateCodeDto) {
    const isValid = await this.authService.validateRecoveryCode(validateCodeDto.code);
    if (!isValid) {
      throw new UnauthorizedException('Código inválido o ha expirado');
    }
    return { message: 'Código válido' };
  }

  // Cambiar la contraseña usando el código de recuperación
  @Put('change-password-code')
  async changePasswordUsingCode(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePasswordUsingCode(changePasswordDto);
  }
}
