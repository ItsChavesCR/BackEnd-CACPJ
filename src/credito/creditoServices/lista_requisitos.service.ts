import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

        // Validación adicional para asegurarse de que la descripción no esté vacía o mal formada
        if (!createDto.Descripcion || !Array.isArray(createDto.Descripcion) || createDto.Descripcion.length === 0) {
            throw new BadRequestException('La descripción no puede estar vacía');
        }

        const newRequisito = this.listaRequisitosRepository.create({
            Descripcion: JSON.stringify(createDto.Descripcion),  // Convierte array a JSON string
            tipoCredito: tipoCredito,  // Asigna el objeto de tipo crédito
        });

        console.log('Datos a guardar:', newRequisito);  // Debug log

        return this.listaRequisitosRepository.save(newRequisito);
    }

    async getListaRequisitos(): Promise<ListaRequisitos[]> {
        const requisitos = await this.listaRequisitosRepository.find({ relations: ['tipoCredito'] });

        // Convertir el string JSON de la descripción a un array de strings, y manejar caso de nulo
        return requisitos.map(requisito => ({
            ...requisito,
            Descripcion: requisito.Descripcion ? JSON.parse(requisito.Descripcion) : [],  // Verifica si el campo está vacío
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

        requisito.Descripcion = requisito.Descripcion ? JSON.parse(requisito.Descripcion) : [];  // Verifica si el campo está vacío
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
                where: { Id_TipoCredito: updateDto.tipoCreditoId },
            });
            if (!tipoCredito) {
                throw new NotFoundException('Tipo de crédito no encontrado');
            }
            requisito.tipoCredito = tipoCredito;
        }
    
        // Verifica y convierte la descripción si fue actualizada
        if (updateDto.Descripcion) {
            console.log('Actualizando la descripción:', updateDto.Descripcion);  // Debug log
            requisito.Descripcion = JSON.stringify(updateDto.Descripcion);  // Convierte array a JSON string
        } else {
            console.log('Manteniendo la descripción existente');  // Debug log
        }
    
        return this.listaRequisitosRepository.save(requisito);
    }
}
