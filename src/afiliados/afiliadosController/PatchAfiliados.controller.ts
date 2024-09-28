import { Controller, Post, Body, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { patchAfiliadoService } from '../afiliadosService/patchAfiliado.service';
import { CreatePatchAfiliadoDto } from '../afiliadosDto/create-patchAfiliado.dto';
import { patchAfiliado } from '../afiliadosEntities/patchAfiliado.entity';


@Controller('patch-afiliado')
export class PatchAfiliadoController {
    constructor(private readonly patchAfiliadoService: patchAfiliadoService) {}

    @Post()
    create(@Body() createDto: CreatePatchAfiliadoDto): Promise<patchAfiliado> {
        return this.patchAfiliadoService.createPatchAfiliado(createDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.patchAfiliadoService.deletePatchAfiliado(id);
    }

   
}
