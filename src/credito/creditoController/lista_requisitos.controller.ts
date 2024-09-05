import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ListaRequisitosService } from '../creditoServices/lista_requisitos.service';
import { CreateListaRequisitosDto } from '../creditoDto/create-listaRequisitos.dto';
import { ListaRequisitos } from '../CreditoEntities/lista_requisitos.entity';
import { UpdateListaRequisitosDto } from '../creditoDto/update-listaRequisitos.dto';

@Controller('lista_requisitos')
export class ListaRequisitosController {
    constructor(private readonly listaRequisitosService: ListaRequisitosService) {}

    @Get()
    getListaRequisitos(): Promise<ListaRequisitos[]> {
        return this.listaRequisitosService.getListaRequisitos();
    }

    @Get(':id')
    getListaRequisitosById(@Param('id', ParseIntPipe) id: number): Promise<ListaRequisitos> {
        return this.listaRequisitosService.getListaRequisitosById(id);
    }

    @Post()
    create(@Body() createDto: CreateListaRequisitosDto): Promise<ListaRequisitos> {
        return this.listaRequisitosService.createListaRequisitos(createDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.listaRequisitosService.deleteListaRequisitos(id);
    }

    @Patch(':id')
    updateListaRequisitos(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateListaRequisitosDto) {
        return this.listaRequisitosService.updateListaRequisitos(id, updateDto);
    }
}
