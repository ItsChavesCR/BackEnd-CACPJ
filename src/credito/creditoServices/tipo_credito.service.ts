import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCredito } from '../CreditoEntities/tipo_credito.entity';
import {CreateTipoCreditoDto} from '../creditoDto/create-tipoCredito.dto'
import { UpdateTipoCreditoDto } from '../creditoDto/update-tipoCredito.dto';
import { FuenteFondos } from '../CreditoEntities/fuente_fondos.entity';
@Injectable()
export class TipoCreditoService {
  
  constructor(
    @InjectRepository(TipoCredito)
    private readonly tipoCreditoRepository: Repository<TipoCredito>,

    @InjectRepository(FuenteFondos)
    private readonly fuenteFondosRepository: Repository<FuenteFondos>
) {}
        
    async createTipoCredito(tipoCreditoDto: CreateTipoCreditoDto): Promise<TipoCredito> {
        // Validación: No se permite un tipo de crédito con el mismo nombre
        const existingTipoCredito = await this.tipoCreditoRepository.findOne({
          where: { Nombre_TipoCredito: tipoCreditoDto.Nombre_TipoCredito },
        });
        if (existingTipoCredito) {
          throw new Error(`Ya existe un tipo de crédito con el nombre: ${tipoCreditoDto.Nombre_TipoCredito}`);
        }
    
        // Validación: Asegurarse que todos los campos estén completos
        if (!tipoCreditoDto.Nombre_TipoCredito) {
          throw new Error('Todos los campos son obligatorios.');
        }
    
        // Si pasa las validaciones, se crea el nuevo tipo de crédito
        const newTipoCredito = this.tipoCreditoRepository.create(tipoCreditoDto);
        return this.tipoCreditoRepository.save(newTipoCredito);
      }

    getTipoCredito() {
        return this.tipoCreditoRepository.find()
    }

    getTipoCreditoById(id: number) {
        return this.tipoCreditoRepository.findOne({
            where: {
                Id_TipoCredito: id,
            },
        });
    }

    deleteTipoCredito(id: number) {
        return this.tipoCreditoRepository.delete({Id_TipoCredito: id});
      }

    updateTipoCredito(id: number, TipoCredito: UpdateTipoCreditoDto) {
        return this.tipoCreditoRepository.update({Id_TipoCredito: id}, TipoCredito)
    }

// Método para obtener datos de la vista filtrando por ID
async getCreditDetailsView(tipoCreditoId: number) {
  const result = await this.tipoCreditoRepository.query(
      'CALL GetTipoCredito(?)', // Usa el símbolo de interrogación para los parámetros
      [tipoCreditoId] // Pasa el parámetro como un arreglo
  );

  return result[0]; // Retorna los resultados del procedimiento
}

// Método para obtener datos de TipoGarantia
async getTipoGarantia(tipoCreditoId: number) {
  const result = await this.tipoCreditoRepository.query(
      'CALL GetTipoGarantia(?)',
      [tipoCreditoId]
  );
  return result[0]; // Devuelve las garantías que corresponden al tipo de crédito seleccionado
}

async getFuenteFondos(tipoGarantiaId: number) {
  const result = await this.tipoCreditoRepository.query(
      'CALL GetFuenteFondos(?)',
      [tipoGarantiaId]
  );
  return result[0]; // Devuelve las fuentes de fondos que corresponden al tipo de garantía seleccionada
}


//Obtener tasa interes 
async getTasaInteres(tipoCreditoId: number, tipoGarantiaId: number, fuenteFondoId: number) {
  // Encuentra la fuente de fondos por su ID
  const fuenteFondo = await this.fuenteFondosRepository.findOne({
      where: { Id_FuenteFondos: fuenteFondoId },
  });

  if (!fuenteFondo) {
      throw new Error('Fuente de fondo no encontrada');
  }

  // Retorna la tasa de interés de la fuente de fondos
  return { tasaInteres: fuenteFondo.Tasa_Interes };
}


}