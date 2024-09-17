import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { FuenteFondosService } from '../creditoServices/fuente_fondos.service';
import { CreateFuenteFondosDto } from '../creditoDto/create-fuenteFondos.dto';
import { UpdateFuenteFondosDto } from '../creditoDto/update-fuenteFondos.dto';

@Controller('fuente_fondos')
export class FuenteFondosController {

  constructor(private readonly fuenteFondosService: FuenteFondosService) {}

  @Get()
  getFuenteFondos() {
    return this.fuenteFondosService.getFuenteFondos();
  }

  @Get(':id')
  getFuenteFondosById(@Param('id', ParseIntPipe) id: number) {
    return this.fuenteFondosService.getFuenteFondosById(id);
  }

  @Post()
  create(@Body() createFuenteFondosDto: CreateFuenteFondosDto) {
    return this.fuenteFondosService.createFuenteFondos(createFuenteFondosDto);
  }

  @Delete(':id')
  deleteFuenteFondos(@Param('id', ParseIntPipe) id: number) {
    return this.fuenteFondosService.deleteFuenteFondos(id);
  }

  @Patch(':id')
  updateFuenteFondos(@Param('id', ParseIntPipe) id: number, @Body() updateFuenteFondosDto: UpdateFuenteFondosDto) {
    return this.fuenteFondosService.updateFuenteFondos(id, updateFuenteFondosDto);
  }
}
