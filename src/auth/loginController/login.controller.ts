/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Get, Put, Request } from '@nestjs/common';
import { LoginService } from '../loginService/login.service';
import { LoginDto } from '../loginDto/login.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ChangePasswordDto } from '../loginDto/change-password.dto';


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
}

