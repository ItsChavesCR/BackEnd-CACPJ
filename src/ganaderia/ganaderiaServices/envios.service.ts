import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Envios } from '../ganaderiaEntities/envios.entity';
import { CreateEnviosDto } from '../ganaderiaDto/create-envios.dto';
import { UpdateEnviosDto } from '../ganaderiaDto/update-envios.dto';
import { Ganadero } from '../ganaderiaEntities/ganadero.entity'; // Importa Ganadero para buscarlo

@Injectable()
export class EnviosService {
  constructor(
    @InjectRepository(Envios)
    private readonly enviosRepository: Repository<Envios>,

    @InjectRepository(Ganadero) // Repositorio para Ganadero
    private readonly ganaderoRepository: Repository<Ganadero>,
  ) {}

  // Método para obtener todos los envíos
  async findAll(): Promise<Envios[]> {
    return this.enviosRepository.find({ relations: ['ganadero'] });
  }

  // Crea un envío
  async create(createEnviosDto: CreateEnviosDto): Promise<Envios> {
    const { idGanadero, ...rest } = createEnviosDto;
  
    // Busca el Ganadero en la base de datos usando el objeto de búsqueda correcto
    const ganadero = await this.ganaderoRepository.findOne({
      where: { idGanadero }, // Usa la opción "where" para buscar por idGanadero
    });
    
    if (!ganadero) {
      throw new NotFoundException(`Ganadero with ID ${idGanadero} not found`);
    }
  
    // Crea el envío con el Ganadero asociado
    const envio = this.enviosRepository.create({
      ...rest,
      ganadero, // Asocia el Ganadero encontrado
    });
  
    // Calcula el total antes de guardar
    envio.total = this.calculateTotal(envio);

    return this.enviosRepository.save(envio);
  }

  // Encuentra un envío por ID y calcula el total
  async findOne(id: number): Promise<Envios> {
    const envio = await this.enviosRepository.findOne({
      where: { idEnvio: id },
      relations: ['ganadero'],
    });
    if (!envio) {
      throw new NotFoundException(`Envio with ID ${id} not found`);
    }

    // Calcula el total al obtener el envío
    envio.total = this.calculateTotal(envio);

    return envio;
  }

  // Actualiza un envío
  async update(id: number, updateEnviosDto: UpdateEnviosDto): Promise<Envios> {
    const envio = await this.enviosRepository.preload({
      idEnvio: id,
      ...updateEnviosDto,
    });

    if (!envio) {
      throw new NotFoundException(`Envio with ID ${id} not found`);
    }

    // Calcula el total antes de guardar los cambios
    envio.total = this.calculateTotal(envio);

    return this.enviosRepository.save(envio);
  }

  // Calcula el total sumando montoTotal, bonoProductor, reconocimiento, y excedente
  private calculateTotal(envio: Envios): number {
    return (
      (envio.montoTotal || 0) +
      (envio.bonoProductor || 0) +
      (envio.reconocimiento || 0) +
      (envio.excedente || 0)
    );
  }

  /*
  async remove(id: number): Promise<void> {
    const envio = await this.findOne(id);
    await this.enviosRepository.remove(envio);
  }
  */
}
