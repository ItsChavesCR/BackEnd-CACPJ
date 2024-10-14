import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuenteFondos } from '../CreditoEntities/fuente_fondos.entity';
import { CreateFuenteFondosDto } from '../creditoDto/create-fuenteFondos.dto';
import { UpdateFuenteFondosDto } from '../creditoDto/update-fuenteFondos.dto';
import { TipoGarantia } from '../CreditoEntities/tipo_garantia.entity';

@Injectable()
export class FuenteFondosService {

  constructor(
    @InjectRepository(FuenteFondos)
    private readonly fuenteFondosRepository: Repository<FuenteFondos>,

    @InjectRepository(TipoGarantia)
    private readonly tipoGarantiaRepository: Repository<TipoGarantia>, 
  ) {}

  async createFuenteFondos(createFuenteFondosDto: CreateFuenteFondosDto) {
    const { tipoGarantiaId, ...rest } = createFuenteFondosDto;

    // Buscar TipoGarantia por ID
    const tipoGarantia = await this.tipoGarantiaRepository.findOne({ where: { Id_TipoGarantia: tipoGarantiaId } });
    
    if (!tipoGarantia) {
      throw new NotFoundException(`Tipo de Garantía con ID ${tipoGarantiaId} no encontrado`);
    }

    // Crear el registro de FuenteFondos con la relación correcta
    const newFuenteFondos = this.fuenteFondosRepository.create({
      ...rest,
      tipoGarantia,  // Asignamos la relación con el objeto tipoGarantia
    });

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
