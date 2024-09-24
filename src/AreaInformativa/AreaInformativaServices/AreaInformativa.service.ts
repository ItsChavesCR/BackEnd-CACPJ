/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaInformativa } from '../AreaInformativaEntities/AreaInformativa.entity';
import { CreateInformativaDto } from '../AreaInformativaDto/create-areaInformativa.dto';
import { UpdateInformativaDto } from '../AreaInformativaDto/update-areaInformativa.dto';
import { Categoria } from '../AreaInformativaEntities/Categoria.entity';
import { CategoriaService } from './Categoria.service';


@Injectable()
export class AreaInformativaService {  
  constructor(
    @InjectRepository(AreaInformativa)
    private readonly informacionRepository: Repository<AreaInformativa>,
    private readonly categoriaService: CategoriaService  // Aquí inyectas el servicio directamente
  ) {}
  

  async create(
    createInformativaDto: CreateInformativaDto,
    categoria: Categoria,  // Pasamos la categoría ya validada
  ): Promise<AreaInformativa> {
    const nuevaInformacion = this.informacionRepository.create({
      ...createInformativaDto,
      categoria,  // Asignamos la categoría
    });
    return this.informacionRepository.save(nuevaInformacion);
  }
  

  async GetAll(): Promise<AreaInformativa[]> {
    return this.informacionRepository.find({ relations: ['categoria'] });  // Cargar la relación 'categoria'
  }

  async GetById(id: number): Promise<AreaInformativa> {
    const informacion = await this.informacionRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });
    return informacion;
  }

  async update(id: number, updateInformativaDto: UpdateInformativaDto): Promise<AreaInformativa> {
    const areaInformativa = await this.informacionRepository.findOne({ where: { id } });
    if (!areaInformativa) {
      throw new HttpException('Área no encontrada', HttpStatus.NOT_FOUND);
    }
  
    const categoria = await this.categoriaService.GetById(updateInformativaDto.categoriaId);  // Validar si la categoría existe
    if (!categoria) {
      throw new HttpException('Categoría no encontrada', HttpStatus.BAD_REQUEST);
    }
  
    Object.assign(areaInformativa, updateInformativaDto);
    areaInformativa.categoria = categoria;  // Asignar la nueva categoría
    return this.informacionRepository.save(areaInformativa);
  }
  

  async remove(id: number): Promise<boolean> {
    const result = await this.informacionRepository.delete(id);
    return result.affected > 0;
  }
}
