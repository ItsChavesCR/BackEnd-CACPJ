import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { FuenteFondos } from '../CreditoEntities/fuente_fondos.entity';
import { TipoCredito } from '../CreditoEntities/tipo_credito.entity';
import { TipoGarantia } from '../CreditoEntities/tipo_garantia.entity';

@Injectable()
export class CreditoService {
  constructor(
    @InjectRepository(TipoCredito)
    private tipoCreditoRepository: Repository<TipoCredito>,
    
    @InjectRepository(TipoGarantia)
    private tipoGarantiaRepository: Repository<TipoGarantia>,
    
    @InjectRepository(FuenteFondos)
    private fuenteFondosRepository: Repository<FuenteFondos>,
  ) {}

  // Método para calcular la cuota mensual
  async calcularCuotaMensual(
    Id_TipoCredito: number,
    Id_TipoGarantia: number,
    Id_FuenteFondos: number,
    monto: number,
    plazo: number
  ): Promise<number> {
    // Obtener los datos de tipo de crédito
    const tipoCredito = await this.tipoCreditoRepository.findOne({
      where: { Id_TipoCredito },
    });
    console.log('TipoCredito encontrado:', tipoCredito);
  
    // Obtener los datos de tipo de garantía
    const tipoGarantia = await this.tipoGarantiaRepository.findOne({
      where: { Id_TipoGarantia },
    });
    console.log('TipoGarantia encontrado:', tipoGarantia);
  
    // Obtener los datos de fuente de fondos
    const fuenteFondos = await this.fuenteFondosRepository.findOne({
      where: { Id_FuenteFondos, tipoGarantia },  // Verificamos que el Id y la relación sean correctos
    });
    console.log('FuenteFondos encontrado:', fuenteFondos);
  
    // Validar que los datos existan
    if (!tipoCredito || !tipoGarantia || !fuenteFondos) {
      console.log('Validación fallida:', {
        tipoCredito,
        tipoGarantia,
        fuenteFondos,
      });
      throw new BadRequestException('Datos de crédito, garantía o fondos no válidos.');
    }
  
    // Tasa de interés anual obtenida de FuenteFondos
    const tasaInteresAnual = fuenteFondos.Tasa_Interes;
    console.log('Tasa de Interés Anual:', tasaInteresAnual);
  
    // Convertir la tasa anual en mensual
    const tasaInteresMensual = tasaInteresAnual / 12 / 100;
    console.log('Tasa de Interés Mensual:', tasaInteresMensual);
  
    // Calcular cuota mensual utilizando la fórmula de amortización
    const cuotaMensual = (monto * tasaInteresMensual * Math.pow(1 + tasaInteresMensual, plazo)) /
                         (Math.pow(1 + tasaInteresMensual, plazo) - 1);
    console.log('Cuota Mensual Calculada:', cuotaMensual);
  
    return cuotaMensual;
  }
  


  //////////7
  async getAllFuenteFondos(): Promise<FuenteFondos[]> {
    return await this.fuenteFondosRepository.find({ relations: ['tipoGarantia'] });
  }

}
