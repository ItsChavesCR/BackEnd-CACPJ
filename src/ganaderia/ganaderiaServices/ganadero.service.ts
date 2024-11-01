// src/ganadero/ganadero.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ganadero } from '../ganaderiaEntities/ganadero.entity';
import { CreateGanaderoDto } from '../ganaderiaDto/create-ganadero.dto';

@Injectable()
export class GanaderoService {
  constructor(
    @InjectRepository(Ganadero)
    private readonly ganaderoRepository: Repository<Ganadero>,
  ) {}

  async create(createGanaderoDto: CreateGanaderoDto): Promise<Ganadero> {
    const ganadero = this.ganaderoRepository.create(createGanaderoDto);
    await this.ganaderoRepository.save(ganadero);
  
    // Realiza una búsqueda completa para obtener el afiliado relacionado
    return this.ganaderoRepository.findOne({
      where: { idGanadero: ganadero.idGanadero },
      relations: ['afiliado'],  // Incluir afiliado en la respuesta
    });
  }

  async findAll(): Promise<Ganadero[]> {
    const ganaderos = await this.ganaderoRepository.find({ relations: ['afiliado'] });
    // Filtra los ganaderos para incluir solo aquellos cuyo afiliado tiene comercializacion en true
    return ganaderos.filter(ganadero => ganadero.afiliado.comercializacion);
  }

  async findOne(id: number): Promise<Ganadero> {
    const ganadero = await this.ganaderoRepository.findOne({
      where: { idGanadero: id },
      relations: ['afiliado'],
    });
    if (!ganadero) {
      throw new NotFoundException(`Ganadero with ID ${id} not found`);
    }
    return ganadero;
  }

  

  // async update(id: number, updateGanaderoDto: UpdateGanaderoDto): Promise<Ganadero> {
  //   const ganadero = await this.ganaderoRepository.preload({
  //     idGanadero: id,
  //     ...updateGanaderoDto,
  //   });
  //   if (!ganadero) {
  //     throw new NotFoundException(`Ganadero with ID ${id} not found`);
  //   }
  //   return this.ganaderoRepository.save(ganadero);
  // }

  // async remove(id: number): Promise<void> {
  //   const ganadero = await this.findOne(id);
  //   await this.ganaderoRepository.remove(ganadero);
  // }
}
