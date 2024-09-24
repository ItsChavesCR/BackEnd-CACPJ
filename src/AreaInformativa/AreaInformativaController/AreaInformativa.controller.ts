/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { AreaInformativaService } from "../AreaInformativaServices/AreaInformativa.service";
import { CreateInformativaDto } from "../AreaInformativaDto/create-areaInformativa.dto";
import { UpdateInformativaDto } from "../AreaInformativaDto/update-areaInformativa.dto";
import { AreaInformativa } from "../AreaInformativaEntities/AreaInformativa.entity";
import { CategoriaService } from "../AreaInformativaServices/Categoria.service";

@Controller('informativa')  // La ruta base no cambia, pero puede modificarse si lo prefieres
export class AreaInformativaController {  // Nombre modificado
  constructor(private readonly informacionService: AreaInformativaService,
              private readonly categoriaService: CategoriaService
  ) {}
 
  @Post()
async create(
  @Body() createInformativaDto: CreateInformativaDto,
): Promise<AreaInformativa> {
  const categoria = await this.categoriaService.GetById(createInformativaDto.categoriaId); // Verificamos si la categoría existe
  if (!categoria) {
    throw new HttpException('Categoría no encontrada', HttpStatus.BAD_REQUEST);
  }

  return this.informacionService.create(createInformativaDto, categoria);  // Creamos el AreaInformativa con la categoría
}


  @Get()
  async findAll() {
    return this.informacionService.GetAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const areaInformativa = await this.informacionService.GetById(id);  // Invoca el servicio para buscar el área informativa
    if (!areaInformativa) {
      throw new HttpException('Área informativa no encontrada', HttpStatus.NOT_FOUND);  // Si no se encuentra, lanzamos un 404
    }
    return areaInformativa;  // Si se encuentra, retornamos el resultado
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateInformativaDto: UpdateInformativaDto) {
    return this.informacionService.update(id, updateInformativaDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.informacionService.remove(id);  // Invoca el servicio para eliminar
    if (!result) {
      throw new HttpException('Área informativa no encontrada para eliminar', HttpStatus.NOT_FOUND);
    }
    return { message: `Área informativa con ID ${id} eliminada correctamente` };
  }
}
