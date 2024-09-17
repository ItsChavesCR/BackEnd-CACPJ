/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Afiliado } from '../afiliadosEntities/afiliados.entity';
import { Repository } from 'typeorm';
import { CreateAfiliadoDto } from '../afiliadosDto/create-afiliados.dto';
import { UpdateAfiliadoDto } from '../afiliadosDto/update-afiliados.dto';

@Injectable()
export class AfiliadosService {

    constructor(
        @InjectRepository(Afiliado) private afiliadosRepository: Repository<Afiliado>,

    ) {}

    getAfiliados() {
        return this.afiliadosRepository.find();
    }
    async getAfiliado(afiliadoId: number) {
        const afiliadoFound = await this.afiliadosRepository.findOne({
            where: {
                afiliadoId
            }
        })
        if (!afiliadoFound) {
            return new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        return afiliadoFound;
    }

    async createAfiliado(afiliado: CreateAfiliadoDto): Promise<Afiliado> {
        // Validación adicional para la cédula
        if (!/^\d{9}$/.test(afiliado.cedula)) {
            throw new BadRequestException('La cédula debe tener 9 dígitos');
        }
    
        const afiliadoFound = await this.afiliadosRepository.findOne({
            where: { cedula: afiliado.cedula }
        });
    
        if (afiliadoFound) {
            throw new HttpException('Afiliado already exists', HttpStatus.CONFLICT);
        }
    
        const newAfiliado = this.afiliadosRepository.create({
            ...afiliado,
        });
    
        const savedAfiliado = await this.afiliadosRepository.save(newAfiliado);
    
    
        return savedAfiliado;
    }
    

    async updateAfiliado(afiliadoId: number, afiliado: UpdateAfiliadoDto) {
        const result = await this.afiliadosRepository.update({ afiliadoId }, afiliado);
    
        if (result.affected === 0) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        return result;
    }
    

    async deleteAfiliado(afiliadoId : number){  
        const result = await this.afiliadosRepository.delete({ afiliadoId });

        if(result.affected === 0){
            return new HttpException('User not found', HttpStatus.NOT_FOUND )
        }

        return result;
    }

    async getAfiliadosWithFilters(
        ubicacion?: string, 
        genero?: string, 
        actividades?: string, 
        comercializa?: boolean
    ): Promise<Afiliado[]> {
        const queryBuilder = this.afiliadosRepository.createQueryBuilder('afiliado');

        if (ubicacion) {
            queryBuilder.andWhere('afiliado.direccion LIKE :ubicacion', { ubicacion: `%${ubicacion}%` });
        }

        if (genero) {
            queryBuilder.andWhere('afiliado.genero = :genero', { genero });
        }

        if (actividades) {
            queryBuilder.andWhere('afiliado.actividadesAgricolas LIKE :actividades', { actividades: `%${actividades}%` });
        }

        if (comercializa !== undefined) {
            queryBuilder.andWhere('afiliado.comercializacion = :comercializa', { comercializa });
        }

        return await queryBuilder.getMany();
    }

}