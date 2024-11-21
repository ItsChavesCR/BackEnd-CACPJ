

// src/envios/envios.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { EnviosService } from '../ganaderiaServices/envios.service';
import { CreateEnviosDto } from '../ganaderiaDto/create-envios.dto';
import { UpdateEnviosDto } from '../ganaderiaDto/update-envios.dto';
import { Envios } from '../ganaderiaEntities/envios.entity';

@Controller('envios')
export class EnviosController {
  constructor(private readonly enviosService: EnviosService) { }

  @Post()
  create(@Body() createEnviosDto: CreateEnviosDto) {
    return this.enviosService.create(createEnviosDto);
  }

  @Get()
  findAll() {
    return this.enviosService.findAll();
  }

  @Get('filtrarEnvios')
  async getEnviosFiltrados(
    @Query('idGanadero') idGanadero?: number,
    @Query('fechaInicio') fechaInicio?: Date,
    @Query('fechaFin') fechaFin?: Date,
  ): Promise<Envios[]> {
    return this.enviosService.getEnviosWithFilters({ idGanadero, fechaInicio, fechaFin });
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enviosService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnviosDto: UpdateEnviosDto) {
    return this.enviosService.update(+id, updateEnviosDto);
  }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.enviosService.remove(+id);
    }
  
    


  // Endpoint para generar y descargar el PDF de los envíos filtrados
  @Get('GenerarEnviosPDF/descargar')
  async downloadEnviosPDF(
    @Query('idGanadero') idGanadero: number,
    @Query('fechaInicio') fechaInicio: Date,
    @Query('fechaFin') fechaFin: Date,
    @Res() res
  ) {
    const buffer = await this.enviosService.generarPDFEnvios({ idGanadero, fechaInicio, fechaFin });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=envios_reporte.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);  // Enviar el buffer como respuesta
  }



}
