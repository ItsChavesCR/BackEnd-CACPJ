import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListaRequisitos } from '../CreditoEntities/lista_requisitos.entity';
import { CreateListaRequisitosDto } from '../creditoDto/create-listaRequisitos.dto';
import { UpdateListaRequisitosDto } from '../creditoDto/update-listaRequisitos.dto';
import { TipoCredito } from '../CreditoEntities/tipo_credito.entity';

@Injectable()
export class ListaRequisitosService {
    constructor(
        @InjectRepository(ListaRequisitos)
        private listaRequisitosRepository: Repository<ListaRequisitos>,
        @InjectRepository(TipoCredito)
        private tipoCreditoRepository: Repository<TipoCredito>,
    ) {}

    async createListaRequisitos(createDto: CreateListaRequisitosDto): Promise<ListaRequisitos> {
        const tipoCredito = await this.tipoCreditoRepository.findOne({ where: { Id_TipoCredito: createDto.tipoCreditoId } });
        if (!tipoCredito) {
            throw new NotFoundException('Tipo de crédito no encontrado');
        }

        const newRequisito = this.listaRequisitosRepository.create({
            Descripcion: JSON.stringify(createDto.Descripcion),  // Convierte array a JSON string
            tipoCredito: tipoCredito,  // Asigna el objeto de tipo crédito
        });

        return this.listaRequisitosRepository.save(newRequisito);
    }

    async getListaRequisitos(): Promise<ListaRequisitos[]> {
        const requisitos = await this.listaRequisitosRepository.find({ relations: ['tipoCredito'] });

        // Convertir el string JSON de la descripción a un array de strings
        return requisitos.map(requisito => ({
            ...requisito,
            Descripcion: JSON.parse(requisito.Descripcion),  // Convierte JSON string a array
        }));
    }

    async getListaRequisitosById(id: number): Promise<ListaRequisitos> {
        const requisito = await this.listaRequisitosRepository.findOne({
            where: { Id_Requisito: id },
            relations: ['tipoCredito'],
        });

        if (!requisito) {
            throw new NotFoundException('Requisito no encontrado');
        }

        requisito.Descripcion = JSON.parse(requisito.Descripcion);  // Convierte JSON string a array
        return requisito;
    }

    async deleteListaRequisitos(id: number): Promise<void> {
        const result = await this.listaRequisitosRepository.delete({ Id_Requisito: id });
        if (result.affected === 0) {
            throw new NotFoundException('Requisito no encontrado');
        }
    }

    async updateListaRequisitos(id: number, updateDto: UpdateListaRequisitosDto): Promise<ListaRequisitos> {
        const requisito = await this.listaRequisitosRepository.findOne({ where: { Id_Requisito: id } });
        if (!requisito) {
            throw new NotFoundException('Requisito no encontrado');
        }
    
        // Verifica y actualiza el tipo de crédito
        if (updateDto.tipoCreditoId) {
            const tipoCredito = await this.tipoCreditoRepository.findOne({
                where: { Id_TipoCredito: updateDto.tipoCreditoId },  // Cambiado a un objeto de búsqueda
            });
            if (!tipoCredito) {
                throw new NotFoundException('Tipo de crédito no encontrado');
            }
            requisito.tipoCredito = tipoCredito;
        }
    
        // Verifica y convierte la descripción si fue actualizada
        if (updateDto.Descripcion) {
            console.log('Antes de convertir:', updateDto.Descripcion); // Verificar el contenido
            requisito.Descripcion = JSON.stringify(updateDto.Descripcion);  // Convierte array a JSON string
        }
    
        // Elimina el Object.assign para actualizar campos de forma específica
        return this.listaRequisitosRepository.save(requisito);
    } 
    
}
