import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ConsultasAiService } from '../AreaInformativaServices/Consultas_AI.service';
import { ConsultasAI } from '../AreaInformativaEntities/Consultas_AI.entity';
import { CreateConsultasAiDto } from '../AreaInformativaDto/create-consultasAI.dto';


@Controller('Consultas_AI')
export class ConsultasAiController {

    constructor(private readonly consultasAiService: ConsultasAiService) {}

    @Get()
    getConsultas(): Promise<ConsultasAI[]> {
        return this.consultasAiService.getConsultas();
    }

    @Post()
    create(@Body() createDto: CreateConsultasAiDto): Promise<ConsultasAI> {
        return this.consultasAiService.createConsultas(createDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.consultasAiService.deleteConsultas(id);
    }

}
