import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagoPsa } from '../psaEntities/pago_psa.entity';
import { Psa } from '../psaEntities/Psa.entity';
import { PagoPsaResponseDto } from '../psaDto/get-pagoPsa.dto';


@Injectable()
export class PagoPsaService {
  constructor(
    @InjectRepository(PagoPsa) private pagoPsaRepository: Repository<PagoPsa>,
    @InjectRepository(Psa) private psaRepository: Repository<Psa>,
  ) {}


  async agregarPago(idPsa: number, pago: { Fecha_Pago: Date }): Promise<PagoPsa> {
    // Buscar el PSA
    const psa = await this.psaRepository.findOne({ where: { Id_Psa: idPsa }, relations: ['pagos'] });
  
    if (!psa) {
      throw new NotFoundException('PSA no encontrado');
    }
  
    // Encontrar el último pago realizado para este PSA y calcular el siguiente número de pago
    const ultimoPago = await this.pagoPsaRepository.findOne({
      where: { psa: psa },
      order: { Numero_Pago: 'DESC' },  // Obtener el pago con el mayor número
    });
  
    // El siguiente número de pago será el número del último pago + 1, o 1 si no hay pagos anteriores
    const numeroDePago = ultimoPago ? ultimoPago.Numero_Pago + 1 : 1;
  
    // Crear el nuevo pago con el siguiente número
    const nuevoPago = this.pagoPsaRepository.create({
      Fecha_Pago: pago.Fecha_Pago,
      Numero_Pago: numeroDePago,
      psa: psa,
    });
  
    // Guardar el nuevo pago
    return this.pagoPsaRepository.save(nuevoPago);
  }
  

  async getPagosByCedula(cedula: string): Promise<{ nombre: string, pagos: PagoPsaResponseDto[] }> {
    const psa = await this.psaRepository.findOne({
      where: { Cedula: cedula },
      relations: ['pagos'],
    });
  
    if (!psa) {
      throw new NotFoundException(`No se encontró PSA asociado a la cédula ${cedula}`);
    }
  
    // Mapear los pagos a PagoPsaResponseDto
    const pagos = psa.pagos.map(pago => ({
      Numero_Pago: pago.Numero_Pago,
      Fecha_Pago: pago.Fecha_Pago,
    }));
  
    return {
      nombre: psa.Nombre_Completo,
      pagos: pagos,
    };
  }
  
  async getPagosByIdPsa(idPsa: number): Promise<{ nombre: string, pagos: PagoPsaResponseDto[] }> {
    const psa = await this.psaRepository.findOne({
      where: { Id_Psa: idPsa },
      relations: ['pagos'],
    });
  
    if (!psa) {
      throw new NotFoundException(`No se encontró PSA con el ID ${idPsa}`);
    }
  
    // Mapear los pagos a PagoPsaResponseDto
    const pagos = psa.pagos.map(pago => ({
      Numero_Pago: pago.Numero_Pago,
      Fecha_Pago: pago.Fecha_Pago,
    }));
  
    return {
      nombre: psa.Nombre_Completo,
      pagos: pagos,
    };
  }
  
}
