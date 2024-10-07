/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { LoginService } from '../loginService/login.service';
import { LoginDto } from '../loginDto/login.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';


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
}

