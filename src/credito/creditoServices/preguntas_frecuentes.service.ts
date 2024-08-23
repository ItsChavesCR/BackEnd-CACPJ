import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreguntasFrecuentes } from '../CreditoEntities/preguntas_frecuentes.entity';
import { CreatePreguntasFrecuentesDto } from '../creditoDto/create-preguntaFrecuente.dto';
import { UpdatePreguntasFrecuentesDto } from '../creditoDto/update-preguntaFrecuente.dto';

@Injectable()
export class PreguntasFrecuentesService {
  
    constructor(@InjectRepository(PreguntasFrecuentes) private preguntasFrecuentesRepository: Repository<PreguntasFrecuentes>) {}

    createPreguntasFrecuentes(PreguntasFrecuentesDto: CreatePreguntasFrecuentesDto): Promise<PreguntasFrecuentes> {
        const newPregunta = this.preguntasFrecuentesRepository.create(PreguntasFrecuentesDto);
        return this.preguntasFrecuentesRepository.save(newPregunta);
    }

    getPreguntasFrecuentes(): Promise<PreguntasFrecuentes[]> {
        return this.preguntasFrecuentesRepository.find();
    }

    getPreguntasFrecuentesById(id: number): Promise<PreguntasFrecuentes> {
        return this.preguntasFrecuentesRepository.findOne({
            where: { Id_Pregunta: id }
        });
    }

    deletePreguntasFrecuentes(id: number): Promise<void> {
        return this.preguntasFrecuentesRepository.delete({ Id_Pregunta: id }).then(() => {});
    }

    updatePreguntasFrecuentes(id: number, PreguntasFrecuentes: UpdatePreguntasFrecuentesDto) {
        return this.preguntasFrecuentesRepository.update({ Id_Pregunta: id }, PreguntasFrecuentes)
    }
}