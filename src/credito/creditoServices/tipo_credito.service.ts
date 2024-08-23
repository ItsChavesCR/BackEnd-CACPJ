import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCredito } from '../CreditoEntities/tipo_credito.entity';
import {CreateTipoCreditoDto} from '../creditoDto/create-tipoCredito.dto'
import { UpdateTipoCreditoDto } from '../creditoDto/update-tipoCredito.dto';

@Injectable()
export class TipoCreditoService {
  
    constructor(@InjectRepository(TipoCredito)private readonly tipoCreditoRepository: Repository<TipoCredito>) {}
        
    createTipoCredito(tipoCreditoDto: CreateTipoCreditoDto) {
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
}