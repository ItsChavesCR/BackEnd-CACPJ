import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query, Res } from '@nestjs/common';
import { Psa } from '../psaEntities/Psa.entity';
import { PsaService } from '../psaServices/psa.service';
import { CreatePsaDto } from '../psaDto/create-Psa.dto';



@Controller('psa')
export class PsaController {
    constructor(private readonly psaService: PsaService) { }

    @Get()
    getPsa(
        @Query('cedula') cedula?: string,
        @Query('anoIngreso') anoIngreso?: number,
        @Query('modalidad') modalidad?: string
      ): Promise<Psa[]> {
        return this.psaService.getPsaWithFilters(cedula, anoIngreso, modalidad);
    }

    @Get(':id')
    getPsaById(@Param('id', ParseIntPipe) id: number): Promise<Psa> {
        return this.psaService.getPsaById(id);
    }

    @Post()
    create(@Body() createDto: CreatePsaDto): Promise<Psa> {
        return this.psaService.createPsa(createDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.psaService.deletePsa(id);
    }

    @Patch(':id')
    updatePsa(@Param('id', ParseIntPipe) id: number, @Body() updateDto: CreatePsaDto) {
        return this.psaService.updatePsa(id, updateDto);
    }

    @Get('GenerarPsaPDF/descargar')
    async downloadPDF(
        @Query('anoIngreso') anoIngreso: number,
        @Query('modalidad') modalidad: string,
        @Query('cedula') cedula: string,
        @Res() res
    ): Promise<void> {
        const buffer = await this.psaService.generarPDFPsa({ anoIngreso, modalidad, cedula});

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=psa_reporte.pdf',
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }

}