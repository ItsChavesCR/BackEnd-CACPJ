import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ModalidadService } from '../psaServices/modalidad.service';
import { CreateModalidadDto } from '../psaDto/create-modalidad.dto';
import { Modalidad } from '../psaEntities/modalidad.entity';


@Controller('Modalidad')
export class ModalidadController {
    constructor(private readonly modalidadService: ModalidadService) {}

    @Post()
    create(@Body() createDto: CreateModalidadDto): Promise<Modalidad> {
        return this.modalidadService.createModalidad(createDto);
    }

    @Get()
    getModalidad(): Promise<Modalidad[]> {
        return this.modalidadService.getModalidad();
    }

    @Get(':id')
    getModalidadById(@Param('id', ParseIntPipe) id: number): Promise<Modalidad> {
        return this.modalidadService.getModalidadById(id);
    }

    @Patch(':id')
    updateModalidad(@Param('id', ParseIntPipe) id: number, @Body() updateDto: CreateModalidadDto) {
        return this.modalidadService.updateModalidad(id, updateDto);
    }

   
}
