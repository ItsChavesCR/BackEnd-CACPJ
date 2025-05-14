/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psa } from '../psaEntities/Psa.entity';
import { CreatePsaDto } from '../psaDto/create-Psa.dto';
import { Modalidad } from '../psaEntities/modalidad.entity';
import { UpdatePsaDto } from '../psaDto/update-Psa.dto';
import { PagoPsa } from '../psaEntities/pago_psa.entity';

const PDFDocument = require('pdfkit-table');

@Injectable()
export class PsaService {
  constructor(
    @InjectRepository(Psa) private psaRepository: Repository<Psa>,
    @InjectRepository(Modalidad) private modalidadRepository: Repository<Modalidad>,
  ) { }


  // Método para mapear los pagos a solo mostrar Numero_Pago y Fecha_Pago
  private mapearPagos(pagos: PagoPsa[]): { Numero_Pago: number, Fecha_Pago: Date }[] {
    return pagos.map(pago => ({
      Numero_Pago: pago.Numero_Pago,
      Fecha_Pago: pago.Fecha_Pago,
    }));
  }

  async createPsa(createDto: CreatePsaDto): Promise<Psa> {
    // Validación de cédula...

    // Buscar modalidad por ID en lugar de nombre
    const modalidad = await this.modalidadRepository.findOne({
      where: { Id_Modalidad: createDto.modalidadId },
    });

    if (!modalidad) {
      throw new BadRequestException('La modalidad indicada no existe');
    }

    // Crear PSA asignando la modalidad
    const newPsa = this.psaRepository.create({
      ...createDto,
      modalidad: modalidad,
    });

    return this.psaRepository.save(newPsa);
  }

  async getPsaById(id: number): Promise<any> {
    const psa = await this.psaRepository.findOne({
      where: { Id_Psa: id },
      relations: ['modalidad', 'pagos'],  // Cargar la modalidad y los pagos
    });

    if (!psa) {
      throw new NotFoundException('PSA not found');
    }

    return psa;
  }

  async deletePsa(id: number): Promise<void> {
    // Primero, intenta encontrar el PSA que se quiere eliminar
    const psa = await this.psaRepository.findOne({ where: { Id_Psa: id } });

    if (!psa) {
      throw new NotFoundException(`PSA con ID ${id} no encontrado`);
    }

    // Eliminar el PSA encontrado
    await this.psaRepository.delete(id);

    // Verificar si quedan más registros
    const remainingPsas = await this.psaRepository.find();

    if (remainingPsas.length === 0) {
      // Si no quedan más registros, reiniciar el auto-incremento
      await this.psaRepository.query('ALTER TABLE Agregar_Psa AUTO_INCREMENT = 1');
    }
  }

  // Método para reorganizar los IDs de la tabla PSA para eliminar huecos
  private async reorganizeIds(): Promise<void> {
    const psas = await this.psaRepository.find({ order: { Id_Psa: 'ASC' } });

    for (let i = 0; i < psas.length; i++) {
      const currentPsa = psas[i];

      // Si el ID actual no es igual al índice + 1, lo actualizamos
      const expectedId = i + 1;
      if (currentPsa.Id_Psa !== expectedId) {
        await this.psaRepository.update(currentPsa.Id_Psa, { Id_Psa: expectedId });
      }
    }

    // Reinicia el auto-incremento al valor correcto después de reorganizar
    const nextAutoIncrement = psas.length + 1;
    await this.psaRepository.query(`ALTER TABLE psa AUTO_INCREMENT = ${nextAutoIncrement}`);
  }

  async updatePsa(id: number, updateDto: UpdatePsaDto) {
    const psa = await this.psaRepository.findOne({
      where: { Id_Psa: id },
      relations: ['modalidad'],
    });

    if (!psa) {
      throw new NotFoundException('Psa not found');
    }

    // Si se incluye modalidadId, buscar y asignar la modalidad
    if (updateDto.modalidadId) {
      const modalidad = await this.modalidadRepository.findOne({
        where: { Id_Modalidad: updateDto.modalidadId },
      });

      if (!modalidad) {
        throw new BadRequestException('La modalidad indicada no existe');
      }

      psa.modalidad = modalidad;
      delete updateDto.modalidadId; // Eliminar modalidadId para no guardarlo en la entidad
    }

    // Actualizar los demás campos
    Object.assign(psa, updateDto);

    return this.psaRepository.save(psa);
  }


  async getPsaWithFilters(cedula?: string, anoIngreso?: number, modalidad?: string): Promise<Psa[]> {
    const query = this.psaRepository.createQueryBuilder('psa')
      .leftJoinAndSelect('psa.modalidad', 'modalidad')
      .leftJoinAndSelect('psa.pagos', 'pagos');

    if (cedula) {
      query.andWhere('psa.Cedula = :cedula', { cedula });
    }

    if (anoIngreso) {
      query.andWhere('psa.Año_Ingreso = :anoIngreso', { anoIngreso });
    }

    if (modalidad) {
      query.andWhere('modalidad.Nombre_Modalidad = :modalidad', { modalidad });
    }

    // Devuelve el PSA completo sin modificar la estructura del objeto PagoPsa
    return await query.getMany();
  }


  async obtenerHistorialPorCedula(cedula: string): Promise<{ año: number, modalidad: string }[]> {
    // Buscar todos los registros de PSA asociados a la cédula
    const psas = await this.psaRepository.find({
      where: { Cedula: cedula },
      relations: ['modalidad'],  // Asegurarnos de incluir la relación con la modalidad
      select: ['Año_Ingreso', 'modalidad']  // Seleccionar solo el año y la modalidad
    });

    // Mapear los resultados para devolver un objeto con el año de ingreso y el nombre de la modalidad
    return psas.map(psa => ({
      año: psa.Año_Ingreso,
      modalidad: psa.modalidad.Nombre_Modalidad,  // 'Nombre_Modalidad' es el campo de la modalidad
    }));
  }


  async deactivatePsa(id: number): Promise<Psa> {
    const psa = await this.psaRepository.findOne({ where: { Id_Psa: id } });

    if (!psa) {
      throw new HttpException('PSA no encontrado', HttpStatus.NOT_FOUND);
    }

    psa.isActive = false;
    return this.psaRepository.save(psa);
  }

  async reactivatePsa(id: number): Promise<Psa> {
    const psa = await this.psaRepository.findOne({ where: { Id_Psa: id } });

    if (!psa) {
      throw new HttpException('PSA no encontrado', HttpStatus.NOT_FOUND);
    }

    psa.isActive = true;
    return this.psaRepository.save(psa);
  }

}



