import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../loginEntities/login.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async register(area: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = this.usuarioRepository.create({ area, password: hashedPassword });
    await this.usuarioRepository.save(nuevoUsuario);
    return nuevoUsuario;
  }

  async validateUser(area: string, password: string): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({ where: { area } });
    if (usuario && (await bcrypt.compare(password, usuario.password))) {
      const { password, ...result } = usuario;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { area: user.area, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
