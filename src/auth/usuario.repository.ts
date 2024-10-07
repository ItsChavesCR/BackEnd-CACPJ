/* eslint-disable prettier/prettier */
import {  EntityRepository, Repository } from 'typeorm';
import { Usuario } from './loginEntities/login.entity';


@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> {
  async findByArea(area: string): Promise<Usuario> {
    return this.findOne({ where: { area } });
  }
}
