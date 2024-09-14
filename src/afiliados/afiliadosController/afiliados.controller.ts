/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AfiliadosService } from '../afiliadosService/afiliados.service';
import { Afiliado } from '../afiliadosEntities/afiliados.entity';
import { CreateAfiliadoDto } from '../afiliadosDto/create-afiliados.dto';
import { UpdateAfiliadoDto } from '../afiliadosDto/update-afiliados.dto';

@Controller('afiliados')
export class AfiliadosController {

    constructor(private afiliadosService: AfiliadosService) { }

    @Get()
    getAfiliados(): Promise<Afiliado[]> {
        return this.afiliadosService.getAfiliados()
    }

    @Get(':afiliadoId')
    getAfiliado(@Param('afiliadoId', ParseIntPipe) afiliadoId: number) {
        return this.afiliadosService.getAfiliado(afiliadoId)
    }

    @Post()
    createAfiliado(@Body() newAfiliado: CreateAfiliadoDto) {
        return this.afiliadosService.createAfiliado(newAfiliado)
    }

    @Delete(':afiliadoId')
    deleteAfiliado(@Param('afiliadoId', ParseIntPipe) afiliadoId: number) {
        return this.afiliadosService.deleteAfiliado(afiliadoId);
    }

    @Patch(':afiliadoId')
    updateUser(@Param('afiliadoId', ParseIntPipe) afiliadoId: number, @Body() afiliado: UpdateAfiliadoDto) {
        return this.afiliadosService.updateAfiliado(afiliadoId, afiliado)

    }

}

