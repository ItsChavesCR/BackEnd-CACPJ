/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    async createAfiliado(afiliado : CreateAfiliadoDto){
        const afiliadoFound = await this.afiliadosRepository.findOne({
            where:{cedula : afiliado.cedula
            }
        })

        if(afiliadoFound){
            return new HttpException('Afiliado already exists', HttpStatus.CONFLICT);
        }

        const newAfiliado = this.afiliadosRepository.create(afiliado)
        return this.afiliadosRepository.save(newAfiliado)
    }

    async updateAfiliado (afiliadoId : number, afiliado : UpdateAfiliadoDto){
        const afiliadoFound = await this.afiliadosRepository.findOne({
            where:{
                afiliadoId 
            }
        })

        if(!afiliadoFound){
            return new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        const uptadeUser = Object.assign( afiliadoFound, afiliado )
        return this.afiliadosRepository.save(uptadeUser)
    }

    async deleteAfiliado(afiliadoId : number){  
        const result = await this.afiliadosRepository.delete({ afiliadoId });

        if(result.affected === 0){
            return new HttpException('User not found', HttpStatus.NOT_FOUND )
        }

        return result;
    }
}