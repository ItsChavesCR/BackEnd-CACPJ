import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, Query, Res, NotFoundException } from '@nestjs/common';
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
  async createPsa(@Body() createPsaDto: CreatePsaDto): Promise<Psa> {
    return this.psaService.createPsa(createPsaDto);
  }

  @Delete(':id')
  async deletePsa(@Param('id', ParseIntPipe) id: number) {
    return this.psaService.deletePsa(id);
  }


  @Patch(':id')
  updatePsa(@Param('id', ParseIntPipe) id: number, @Body() updateDto: CreatePsaDto) {
    return this.psaService.updatePsa(id, updateDto);
  }

  @Get('historial/cedula/:cedula')
  async obtenerHistorialPorCedula(@Param('cedula') cedula: string): Promise<{ año: number, modalidad: string }[]> {
    const historial = await this.psaService.obtenerHistorialPorCedula(cedula);

    if (historial.length === 0) {
      throw new NotFoundException(`No se encontró historial de participación para la cédula ${cedula}`);
    }

    return historial;
  }

  // Desactivar un PSA (estado isActive = false)
  @Patch(':id/deactivate')
  async deactivatePsa(@Param('id', ParseIntPipe) id: number): Promise<Psa> {
    return this.psaService.deactivatePsa(id);
  }

  // Reactivar un PSA (estado isActive = true)
  @Patch(':id/reactivate')
  async reactivatePsa(@Param('id', ParseIntPipe) id: number): Promise<Psa> {
    return this.psaService.reactivatePsa(id);
  }

}