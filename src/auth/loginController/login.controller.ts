/* eslint-disable prettier/prettier */ 
import { Controller, Post, Body, UseGuards, Get, Put, Request, UnauthorizedException } from '@nestjs/common';
import { LoginService } from '../loginService/login.service';
import { LoginDto } from '../loginDto/login.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ChangePasswordDto } from '../loginDto/change-password.dto';
import { ChangePasswordRecoveryDto } from '../loginDto/change-password-recovery.dto'; // DTO para recuperación
import { SendRecoveryCodeDto } from '../loginDto/send-recovery-code.dto';  
import { ValidateCodeDto } from '../loginDto/validate-code.dto';  

@Controller('auth')
export class LoginController {
  constructor(private readonly authService: LoginService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('protected')  
  @UseGuards(JwtAuthGuard)  
  getProtectedResource() {
    return { message: 'Accediste a una ruta protegida!' };
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = req.user.sub; 
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Get('usuarios')
  async getAllAreas() {
    return this.authService.getAllAreas(); 
  }

  @Post('send-recovery-code')
  async sendRecoveryCode(@Body() sendRecoveryCodeDto: SendRecoveryCodeDto) {
    return this.authService.sendRecoveryCode(
      sendRecoveryCodeDto.emailOrPhone,  
      'email' 
    );
  }

  @Post('validate-recovery-code')
  async validateRecoveryCode(@Body() validateCodeDto: ValidateCodeDto) {
    const isValid = await this.authService.validateRecoveryCode(validateCodeDto.code);
    if (!isValid) {
      throw new UnauthorizedException('Código inválido o ha expirado');
    }
    return { message: 'Código válido' };
  }

  @Put('change-password-code')
  async changePasswordUsingCode(@Body() changePasswordDto: ChangePasswordRecoveryDto) {
    return this.authService.changePasswordUsingCode(changePasswordDto);
  }
}
