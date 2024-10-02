import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCredito } from '../CreditoEntities/tipo_credito.entity';
import {CreateTipoCreditoDto} from '../creditoDto/create-tipoCredito.dto'
import { UpdateTipoCreditoDto } from '../creditoDto/update-tipoCredito.dto';

@Injectable()
export class TipoCreditoService {
  
    constructor(@InjectRepository(TipoCredito)private readonly tipoCreditoRepository: Repository<TipoCredito>) {}
        
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

    ////////// Calculadora/////////////77

    /*async calcularCuota(tipoCreditoId: number, monto: number, plazo: number): Promise<number> {
        // Obtén el tipo de crédito por ID para obtener la tasa de interés
        const tipoCredito = await this.tipoCreditoRepository.findOne({
            where: { Id_TipoCredito: tipoCreditoId }
        });

        if (!tipoCredito) {
            throw new Error('Tipo de crédito no encontrado');
        }

        const tasaInteresAnual = tipoCredito.Tasa_Interes;
        const tasaInteresMensual = tasaInteresAnual / 12 / 100; // Convierte a tasa mensual
        const n = plazo; // Número de meses

        // Fórmula para calcular la cuota mensual
        const cuotaMensual = (monto * tasaInteresMensual * Math.pow(1 + tasaInteresMensual, n)) /
         (Math.pow(1 + tasaInteresMensual, n) - 1);

         return parseFloat(cuotaMensual.toFixed(2));
    }
         */

}