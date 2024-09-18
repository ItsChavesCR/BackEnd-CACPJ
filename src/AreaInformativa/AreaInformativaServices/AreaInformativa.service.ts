/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateInformativaDto } from "../AreaInformativaDto/create-areaInformativa.dto";
import { AreaInformativa } from "../AreaInformativaEntities/AreaInformativa.entity";
import { UpdateInformativaDto } from "../AreaInformativaDto/update-areaInformativa.dto";
import { CreateCategoriaDto } from "../AreaInformativaDto/create-categoria.dto";
import { Categoria } from "../AreaInformativaEntities/Categoria.entity";
import { UpdateCategoriaDto } from "../AreaInformativaDto/update-categoria.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class InformacionService {
  constructor(
    @InjectRepository(AreaInformativa)
    private readonly informacionRepository: Repository<AreaInformativa>,

    @InjectRepository(Categoria) 
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  // Crear nueva información
  async create(createInformativaDto: CreateInformativaDto): Promise<AreaInformativa> {
    const nuevaInformacion = this.informacionRepository.create(createInformativaDto);
    return this.informacionRepository.save(nuevaInformacion);
  }

  // Obtener todas las informaciones
  async GetAll(): Promise<AreaInformativa[]> {
    const info = await this.informacionRepository.find({ relations: ['categoria'] });
    
    // Validar si algún `categoriaId` es NaN o inválido
    info.forEach(area => {
      if (!area.categoria || isNaN(area.categoria.id)) {
        console.warn('Se encontró un `categoriaId` no válido:', area);
      }
    });

    return info;
  }

  // Obtener una información por ID
  async GetById(id: number): Promise<AreaInformativa> {
    const informacion = await this.informacionRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });
    return informacion;
  }

  // Actualizar información por ID
  async update(id: number, informativa: UpdateInformativaDto) {
    const informativaFound = await this.informacionRepository.findOne({ where: { id } });
    if (!informativaFound) {
      throw new HttpException('Área no encontrada', HttpStatus.NOT_FOUND);
    }

    const updatedInformativa = Object.assign(informativaFound, informativa);
    return this.informacionRepository.save(updatedInformativa);
  }

  // Eliminar información por ID
  async remove(id: number): Promise<boolean> {
    const result = await this.informacionRepository.delete(id);
    return result.affected > 0;
  }

  // Crear una nueva categoría
  async createCategoria(id: number, categoria: CreateCategoriaDto) {
    const areaInformativa = await this.informacionRepository.findOne({ where: { id } });

    if (!areaInformativa) {
      throw new HttpException('Área no encontrada', HttpStatus.NOT_FOUND);
    }

    const newCategoria = this.categoriaRepository.create(categoria);
    const savedCategoria = await this.categoriaRepository.save(newCategoria);

    areaInformativa.categoria = savedCategoria;
    return this.informacionRepository.save(areaInformativa);
  }

  // Obtener todas las categorías
  async GetAllCategorias(): Promise<Categoria[]> {
    const categorias = await this.categoriaRepository.find();
    console.log('Categorías obtenidas:', categorias);  // Log para verificar los resultados
    return categorias;
  }

  // Obtener una categoría por ID
  async GetCategoriaById(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new HttpException('Categoría no encontrada', HttpStatus.NOT_FOUND);
    }
    return categoria;
  }

  // Actualizar una categoría por ID
  async updateCategoria(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });

    if (!categoria) {
      throw new HttpException(`Categoría con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }

    Object.assign(categoria, updateCategoriaDto);
    return this.categoriaRepository.save(categoria);
  }

  // Eliminar una categoría por ID
  async removeCategoria(id: number): Promise<boolean> {
    const result = await this.categoriaRepository.delete(id);
    return result.affected > 0;
  }
}
