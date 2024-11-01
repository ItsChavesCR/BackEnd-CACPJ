import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import { AfiliadosService } from '../afiliadosService/afiliados.service';
import { Afiliado } from '../afiliadosEntities/afiliados.entity';
import { CreateAfiliadoDto } from '../afiliadosDto/create-afiliados.dto';
import { UpdateAfiliadoDto } from '../afiliadosDto/update-afiliados.dto';
import { get } from 'http';

@Controller('afiliados')
export class AfiliadosController {

    constructor(private afiliadosService: AfiliadosService) { }

    @Get()
    getAfiliados(
        @Query('ubicacion') ubicacion?: string,
        @Query('genero') genero?: string,
        @Query('actividades') actividades?: string,
        @Query('comercializa') comercializa?: boolean  // Nuevo filtro
    ): Promise<Afiliado[]> {
        return this.afiliadosService.getAfiliadosWithFilters(ubicacion, genero, actividades, comercializa);
    }

    @Get(':afiliadoId')
    getAfiliado(@Param('afiliadoId', ParseIntPipe) afiliadoId: number) {
        return this.afiliadosService.getAfiliado(afiliadoId);
    }

    @Post()
    createAfiliado(@Body() newAfiliado: CreateAfiliadoDto) {
        return this.afiliadosService.createAfiliado(newAfiliado);
    }

    @Delete(':afiliadoId')
   async deleteAfiliado(@Param('afiliadoId', ParseIntPipe) afiliadoId: number) {
    return await this.afiliadosService.deleteAfiliado(afiliadoId);
}




    @Patch(':afiliadoId')
    updateAfiliado(@Param('afiliadoId', ParseIntPipe) afiliadoId: number, @Body() afiliado: UpdateAfiliadoDto) {
        return this.afiliadosService.updateAfiliado(afiliadoId, afiliado);
    }

     // Desactivar un afiliado (no eliminarlo)
     @Patch(':afiliadoId/deactivate')
     async deactivateAfiliado(@Param('afiliadoId', ParseIntPipe) afiliadoId: number) {
       return this.afiliadosService.deactivateAfiliado(afiliadoId);
     }
 
     // Reactivar un afiliado
     @Patch(':afiliadoId/reactivate')
     reactivateAfiliado(@Param('afiliadoId', ParseIntPipe) afiliadoId: number) {
         return this.afiliadosService.reactivateAfiliado(afiliadoId);
     }

     


    @Get('GenerarAfiliadosPDF/descargar')
    async downloadPDF(
        @Query('ubicacion') ubicacion: string,
        @Query('genero') genero: string,
        @Query('actividades') actividades: string,
        @Query('comercializa') comercializa: boolean,
        @Res() res
    ): Promise<void> {
        const buffer = await this.afiliadosService.generarPDFafiliado({ ubicacion, genero, actividades, comercializa });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=afiliados_reporte.pdf',
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}
