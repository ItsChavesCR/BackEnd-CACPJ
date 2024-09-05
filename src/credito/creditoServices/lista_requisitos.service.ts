import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListaRequisitos } from '../CreditoEntities/lista_requisitos.entity';
import { CreateListaRequisitosDto } from '../creditoDto/create-listaRequisitos.dto';
import { UpdateListaRequisitosDto } from '../creditoDto/update-listaRequisitos.dto';

@Injectable()
export class ListaRequisitosService {
    constructor(@InjectRepository(ListaRequisitos) private listaRequisitosRepository: Repository<ListaRequisitos>) {}

    async createListaRequisitos(createDto: CreateListaRequisitosDto): Promise<ListaRequisitos> {
        // Convertimos el array en una cadena JSON
        const newRequisito = this.listaRequisitosRepository.create({
            Descripcion: JSON.stringify(createDto.Descripcion), // Convertimos array a JSON string
            tipoCredito: { Id_TipoCredito: createDto.tipoCreditoId },
        });

        return this.listaRequisitosRepository.save(newRequisito);
    }

    async getListaRequisitos(): Promise<ListaRequisitos[]> {
        const requisitos = await this.listaRequisitosRepository.find({ relations: ['tipoCredito'] });
        // Convertimos las descripciones JSON string a array
        return requisitos.map(requisito => ({
            ...requisito,
            Descripcion: JSON.parse(requisito.Descripcion), // Convertimos JSON string a array
        }));
    }

    async getListaRequisitosById(id: number): Promise<ListaRequisitos> {
        const requisito = await this.listaRequisitosRepository.findOne({
            where: { Id_Requisito: id },
            relations: ['tipoCredito']
        });
        if (requisito) {
            requisito.Descripcion = JSON.parse(requisito.Descripcion); // Convertimos JSON string a array
        }
        return requisito;
    }

    deleteListaRequisitos(id: number) {
        return this.listaRequisitosRepository.delete({ Id_Requisito: id });
    }

    updateListaRequisitos(id: number, updateDto: UpdateListaRequisitosDto) {
        if (updateDto.Descripcion) {
            updateDto.Descripcion = JSON.stringify(updateDto.Descripcion); // Convertimos array a JSON string
        }
        return this.listaRequisitosRepository.update({ Id_Requisito: id }, updateDto);
    }
}
