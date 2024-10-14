import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoGarantia } from '../CreditoEntities/tipo_garantia.entity';
import { CreateTipoGarantiaDto } from '../creditoDto/create-tipoGarantia.dto';
import { UpdateTipoGarantiaDto } from '../creditoDto/update-tipoGarantia.dto';
import { TipoCredito } from '../CreditoEntities/tipo_credito.entity';

@Injectable()
export class TipoGarantiaService {
  constructor(
    @InjectRepository(TipoGarantia)
    private readonly tipoGarantiaRepository: Repository<TipoGarantia>,

    @InjectRepository(TipoCredito)
    private readonly tipoCreditoRepository: Repository<TipoCredito>,
  ) {}

  async create(createTipoGarantiaDto: CreateTipoGarantiaDto) {
    const { tipoCreditoId, Nombre_TipoGarantia } = createTipoGarantiaDto;

    // Buscar el TipoCredito por su ID
    const tipoCredito = await this.tipoCreditoRepository.findOne({ where: { Id_TipoCredito: tipoCreditoId } });

    if (!tipoCredito) {
      throw new NotFoundException(`Tipo de Crédito con ID ${tipoCreditoId} no encontrado`);
    }

    // Crear el registro de TipoGarantia con la relación a TipoCredito
    const newTipoGarantia = this.tipoGarantiaRepository.create({
      Nombre_TipoGarantia,
      tipoCredito,  // Asignar la relación
    });

    return this.tipoGarantiaRepository.save(newTipoGarantia);
  }


  findAll() {
    return this.tipoGarantiaRepository.createQueryBuilder('tipo_garantia')
      .leftJoinAndSelect('tipo_garantia.tipoCredito', 'tipoCredito')
      .getMany()
      .then(data => {
        console.log('Datos obtenidos con QueryBuilder:', JSON.stringify(data, null, 2));
        return data;
      })
      .catch(error => {
        console.error('Error al obtener los datos con QueryBuilder:', error);
        throw error;
      });
  }
  


/*
findAll() {
  return this.tipoGarantiaRepository.find()
    .then(data => {
      console.log('Datos obtenidos sin relaciones:', data);  
      return data;
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
      throw error;
    });
}
*/


  findOne(id: number) {
    return this.tipoGarantiaRepository.findOne({ where: { Id_TipoGarantia: id }, relations: ['tipoCredito'] });
  }

  async update(id: number, updateTipoGarantiaDto: UpdateTipoGarantiaDto) {
    const { tipoCreditoId, Nombre_TipoGarantia } = updateTipoGarantiaDto;
  
    // Buscar el TipoGarantia que queremos actualizar
    const tipoGarantia = await this.tipoGarantiaRepository.findOne({ where: { Id_TipoGarantia: id } });
    if (!tipoGarantia) {
      throw new NotFoundException(`Tipo de Garantía con ID ${id} no encontrado`);
    }
  
    // Buscar el TipoCredito relacionado por el ID proporcionado
    const tipoCredito = await this.tipoCreditoRepository.findOne({ where: { Id_TipoCredito: tipoCreditoId } });
    if (!tipoCredito) {
      throw new NotFoundException(`Tipo de Crédito con ID ${tipoCreditoId} no encontrado`);
    }
  
    // Actualizar los campos y la relación
    tipoGarantia.Nombre_TipoGarantia = Nombre_TipoGarantia;
    tipoGarantia.tipoCredito = tipoCredito;
  
    // Guardar los cambios
    return this.tipoGarantiaRepository.save(tipoGarantia);
  }
  

  remove(id: number) {
    return this.tipoGarantiaRepository.delete(id);
  }
}
