import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultasAI } from '../AreaInformativaEntities/Consultas_AI.entity';
import { CreateConsultasAiDto } from '../AreaInformativaDto/create-consultasAI.dto';

@Injectable()
export class ConsultasAiService {
  
    constructor(@InjectRepository(ConsultasAI) private ConsultasRepository: Repository<ConsultasAI>) {}

    createConsultas(ConsultasDto: CreateConsultasAiDto): Promise<ConsultasAI> {
        const newPregunta = this.ConsultasRepository.create(ConsultasDto);
        return this.ConsultasRepository.save(newPregunta);
    }

    getConsultas(): Promise<ConsultasAI[]> {
        return this.ConsultasRepository.find();
    }

    deleteConsultas(id: number) {
        return this.ConsultasRepository.delete({ Id_Pregunta: id });
    }

}