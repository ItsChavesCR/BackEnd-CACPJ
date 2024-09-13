import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psa } from '../psaEntities/Psa.entity';
import { CreatePsaDto } from '../psaDto/create-Psa.dto';
import { Modalidad } from '../psaEntities/modalidad.entity';

@Injectable()
export class PsaService {
  constructor(
    @InjectRepository(Psa) private psaRepository: Repository<Psa>,
    @InjectRepository(Modalidad) private modalidadRepository: Repository<Modalidad>,
  ) {}

  async createPsa(createDto: CreatePsaDto): Promise<Psa> {
    // Buscar si la modalidad existe por su nombre
    const modalidad = await this.modalidadRepository.findOne({
      where: { Nombre_Modalidad: createDto.Nombre_Modalidad },
    });

    // Si no existe, lanzar una excepción
    if (!modalidad) {
      throw new BadRequestException('La modalidad indicada no existe');
    }

    // Crear el nuevo PSA asignando la modalidad
    const newPsa = this.psaRepository.create({
      ...createDto,
      modalidad: modalidad, // Asignar el objeto Modalidad encontrado
    });

    // Guardar el nuevo PSA
    return this.psaRepository.save(newPsa);
  }

  async getPsa(): Promise<Psa[]> {
    return this.psaRepository.find({
      relations: ['modalidad'], // Asegúrate de cargar la relación con modalidad
    });
  }
  

  async getPsaById(id: number): Promise<Psa> {
    return this.psaRepository.findOne({
      where: { Id_Psa: id },
      relations: ['modalidad'], // Asegúrate de cargar la relación con modalidad
    });
  }
  

  deletePsa(id: number) {
    return this.psaRepository.delete({ Id_Psa: id });
  }

  updatePsa(id: number, updateDto: CreatePsaDto) {
    return this.psaRepository.update({ Id_Psa: id }, updateDto);
  }
}
