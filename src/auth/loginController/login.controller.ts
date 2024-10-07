import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from '../loginService/login.service';
import { CreateLoginDto } from '../loginDto/create-login.dto';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  async register(@Body() createLoginDto: CreateLoginDto) {
    const { area, password } = createLoginDto;
    return this.loginService.register(area, password);
  }

  @Post('login')
  async login(@Body() createLoginDto: CreateLoginDto) {
    const { area, password } = createLoginDto;
    const user = await this.loginService.validateUser(area, password);
    if (!user) {
      return { message: 'Área o contraseña incorrectos' };
    }
    return this.loginService.login(user);
  }
}
