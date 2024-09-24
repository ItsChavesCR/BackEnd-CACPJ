/* eslint-disable prettier/prettier */

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../AreaInformativaEntities/Categoria.entity';
import { CreateCategoriaDto } from '../AreaInformativaDto/create-categoria.dto';
import { UpdateCategoriaDto } from '../AreaInformativaDto/update-categoria.dto';


@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    const newCategoria = this.categoriaRepository.create(createCategoriaDto);
    return this.categoriaRepository.save(newCategoria);
  }

  async GetAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find();
  }

  async GetById(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new HttpException('Categoría no encontrada', HttpStatus.NOT_FOUND);
    }
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new HttpException(`Categoría con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }
    Object.assign(categoria, updateCategoriaDto);
    return this.categoriaRepository.save(categoria);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.categoriaRepository.delete(id);
    return result.affected > 0;
  }
}
