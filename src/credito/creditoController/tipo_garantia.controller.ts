import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TipoGarantiaService } from '../creditoServices/tipo_garantia.service';
import { CreateTipoGarantiaDto } from '../creditoDto/create-tipoGarantia.dto';
import { UpdateTipoGarantiaDto } from '../creditoDto/update-tipoGarantia.dto';

@Controller('tipo_garantia')
export class TipoGarantiaController {
  constructor(private readonly tipoGarantiaService: TipoGarantiaService) {}

  // Crear un nuevo TipoGarantia
  @Post()
  create(@Body() createTipoGarantiaDto: CreateTipoGarantiaDto) {
    return this.tipoGarantiaService.create(createTipoGarantiaDto);
  }

  // Obtener todos los Tipos de Garantía
  @Get()
  findAll() {
    return this.tipoGarantiaService.findAll();
  }

  // Obtener un TipoGarantia por su ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tipoGarantiaService.findOne(id);
  }

  // Actualizar un TipoGarantia por su ID
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTipoGarantiaDto: UpdateTipoGarantiaDto,
  ) {
    return this.tipoGarantiaService.update(id, updateTipoGarantiaDto);
  }

  // Eliminar un TipoGarantia por su ID
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tipoGarantiaService.remove(id);
  }
}
