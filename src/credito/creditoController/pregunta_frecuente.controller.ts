import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { PreguntasFrecuentesService } from '../creditoServices/preguntas_frecuentes.service';
import { CreatePreguntasFrecuentesDto } from '../creditoDto/create-preguntaFrecuente.dto';
import { PreguntasFrecuentes } from '../CreditoEntities/preguntas_frecuentes.entity';
import { UpdatePreguntasFrecuentesDto } from '../creditoDto/update-preguntaFrecuente.dto';

@Controller('preguntas_frecuentes')
export class PreguntasFrecuentesController {

    constructor(private readonly preguntasFrecuentesService: PreguntasFrecuentesService) {}

    @Get()
    getPreguntasFrecuentes(): Promise<PreguntasFrecuentes[]> {
        return this.preguntasFrecuentesService.getPreguntasFrecuentes();
    }

    @Get(':id')
    getPreguntasFrecuentesById(@Param('id', ParseIntPipe) id: number): Promise<PreguntasFrecuentes> {
        return this.preguntasFrecuentesService.getPreguntasFrecuentesById(id);
    }

    @Post()
    create(@Body() createDto: CreatePreguntasFrecuentesDto): Promise<PreguntasFrecuentes> {
        return this.preguntasFrecuentesService.createPreguntasFrecuentes(createDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.preguntasFrecuentesService.deletePreguntasFrecuentes(id);
    }

    @Patch(':id')
    updatePreguntasFrecuentes(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdatePreguntasFrecuentesDto) {
        return this.preguntasFrecuentesService.updatePreguntasFrecuentes(id, updateDto);
    }
}
