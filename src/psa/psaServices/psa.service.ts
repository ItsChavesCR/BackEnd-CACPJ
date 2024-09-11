import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psa } from '../psaEntities/Psa.entity';
import { CreatePsaDto } from '../psaDto/create-Psa.dto';


@Injectable()
export class PsaService {
    constructor(@InjectRepository(Psa) private psaRepository: Repository<Psa>) {}

    async createPsa(createDto: CreatePsaDto): Promise<Psa> {
        const newPsa = this.psaRepository.create(createDto);
        return this.psaRepository.save(newPsa);
    }

    async getPsa(): Promise<Psa[]> {
        return this.psaRepository.find();
    }

    async getPsaById(id: number): Promise<Psa> {
        return this.psaRepository.findOne({ where: { Id_Psa: id } });
    }

    deletePsa(id: number) {
        return this.psaRepository.delete({ Id_Psa: id });
    }

    updatePsa(id: number, updateDto: CreatePsaDto) {
        return this.psaRepository.update({ Id_Psa: id }, updateDto);
    }
}
