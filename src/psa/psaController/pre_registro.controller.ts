import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PreRegistroPsaService } from '../psaServices/pre_registro.service';
import { CreatePreRegistroPsaDto } from '../psaDto/create-preRegistro.dto';
import { PreRegistroPsa } from '../psaEntities/pre_registro.entity';
import { format } from 'date-fns';

@Controller('pre-registro-psa')
export class PreRegistroPsaController {
    constructor(private readonly preRegistroPsaService: PreRegistroPsaService) {}

    @Post()
    create(@Body() createDto: CreatePreRegistroPsaDto): Promise<PreRegistroPsa> {
        return this.preRegistroPsaService.createPreRegistroPsa(createDto);
    }

   
}
