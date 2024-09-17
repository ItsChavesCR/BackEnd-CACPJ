import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoGarantia } from '../CreditoEntities/tipo_garantia.entity';
import { CreateTipoGarantiaDto } from '../creditoDto/create-tipoGarantia.dto';
import { UpdateTipoGarantiaDto } from '../creditoDto/update-tipoGarantia.dto';

@Injectable()
export class TipoGarantiaService {
  constructor(
    @InjectRepository(TipoGarantia)
    private readonly tipoGarantiaRepository: Repository<TipoGarantia>,
  ) {}

  create(createTipoGarantiaDto: CreateTipoGarantiaDto) {
    const tipoGarantia = this.tipoGarantiaRepository.create(createTipoGarantiaDto);
    return this.tipoGarantiaRepository.save(tipoGarantia);
  }

  findAll() {
    return this.tipoGarantiaRepository.find({ relations: ['tipoCredito'] });
  }

  findOne(id: number) {
    return this.tipoGarantiaRepository.findOne({ where: { Id_TipoGarantia: id }, relations: ['tipoCredito'] });
  }

  update(id: number, updateTipoGarantiaDto: UpdateTipoGarantiaDto) {
    return this.tipoGarantiaRepository.update(id, updateTipoGarantiaDto);
  }

  remove(id: number) {
    return this.tipoGarantiaRepository.delete(id);
  }
}
