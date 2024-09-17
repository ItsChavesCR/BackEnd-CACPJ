import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuenteFondos } from '../CreditoEntities/fuente_fondos.entity';
import { CreateFuenteFondosDto } from '../creditoDto/create-fuenteFondos.dto';
import { UpdateFuenteFondosDto } from '../creditoDto/update-fuenteFondos.dto';

@Injectable()
export class FuenteFondosService {

  constructor(
    @InjectRepository(FuenteFondos)
    private readonly fuenteFondosRepository: Repository<FuenteFondos>,
  ) {}

  createFuenteFondos(createFuenteFondosDto: CreateFuenteFondosDto) {
    const newFuenteFondos = this.fuenteFondosRepository.create(createFuenteFondosDto);
    return this.fuenteFondosRepository.save(newFuenteFondos);
  }

  getFuenteFondos() {
    return this.fuenteFondosRepository.find({ relations: ['tipoGarantia'] });
  }

  getFuenteFondosById(id: number) {
    return this.fuenteFondosRepository.findOne({
      where: { Id_FuenteFondos: id },
      relations: ['tipoGarantia'],
    });
  }

  deleteFuenteFondos(id: number) {
    return this.fuenteFondosRepository.delete({ Id_FuenteFondos: id });
  }

  updateFuenteFondos(id: number, updateFuenteFondosDto: UpdateFuenteFondosDto) {
    return this.fuenteFondosRepository.update({ Id_FuenteFondos: id }, updateFuenteFondosDto);
  }
}
