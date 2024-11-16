/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FAQsAi } from '../AreaInformativaEntities/FAQs_AI.entity';
import { CreateFAQsDto } from '../AreaInformativaDto/create-FAQs.dto';
import { UpdateFAQsDto } from '../AreaInformativaDto/update-FAQs.dto';

@Injectable()
export class FAQsAiService {
  
    constructor(@InjectRepository(FAQsAi) private FAQsRepository: Repository<FAQsAi>) {}

    createFAQs(FAQsDto: CreateFAQsDto): Promise<FAQsAi> {
        const newPregunta = this.FAQsRepository.create({
            Pregunta: FAQsDto.Pregunta,
            Respuesta: FAQsDto.Respuesta,
        });
        return this.FAQsRepository.save(newPregunta);
    }
    

    getFAQs(): Promise<FAQsAi[]> {
        return this.FAQsRepository.find();
    }

    getFAQsById(id: number): Promise<FAQsAi> {
        return this.FAQsRepository.findOne({
            where: { Id_Pregunta: id }
        });
    }

    deleteFAQs(id: number) {
        return this.FAQsRepository.delete({ Id_Pregunta: id });
    }

    updateFAQs(id: number, FAQs: UpdateFAQsDto) {
        return this.FAQsRepository.update({ Id_Pregunta: id }, FAQs)
    }
}