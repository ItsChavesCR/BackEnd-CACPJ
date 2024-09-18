/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateInformativaDto } from "../AreaInformativaDto/create-areaInformativa.dto";
import { AreaInformativa } from "../AreaInformativaEntities/AreaInformativa.entity";
import { InformacionService } from "../AreaInformativaServices/AreaInformativa.service";
import { UpdateInformativaDto } from "../AreaInformativaDto/update-areaInformativa.dto";
import { CreateCategoriaDto } from "../AreaInformativaDto/create-categoria.dto";
import { Categoria } from "../AreaInformativaEntities/Categoria.entity";
import { UpdateCategoriaDto } from "../AreaInformativaDto/update-categoria.dto";

@Controller('informativa')
export class InformacionController {
  constructor(private readonly informacionService: InformacionService) {}

  @Post()
  async create(@Body() createInformativaDto: CreateInformativaDto): Promise<AreaInformativa> {
    try {
      return await this.informacionService.create(createInformativaDto);
    } catch (error) {
      throw new HttpException('Error al crear información', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<AreaInformativa[]> {
    try {
      return await this.informacionService.GetAll();
    } catch (error) {
      throw new HttpException('Error al obtener informaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AreaInformativa> {
    const informacion = await this.informacionService.GetById(id);
    if (!informacion) {
      throw new HttpException('Información no encontrada', HttpStatus.NOT_FOUND);
    }
    return informacion;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateInformativaDto: UpdateInformativaDto): Promise<AreaInformativa> {
    return this.informacionService.update(id, updateInformativaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    const isDeleted = await this.informacionService.remove(id);
    if (!isDeleted) {
      throw new HttpException('Información no encontrada para eliminar', HttpStatus.NOT_FOUND);
    }
    return { message: `Información con ID ${id} eliminada correctamente` };
  }

  // CRUD para Categorías
  @Post(':id/categorias')
  createCategoria(@Param('id', ParseIntPipe) id: number, @Body() categoria: CreateCategoriaDto) {
    return this.informacionService.createCategoria(id, categoria);
  }

  @Get('categorias')
  async findAllCategorias(): Promise<Categoria[]> {
    return this.informacionService.GetAllCategorias();
  }

  @Get('categorias/:id')
  async findCategoriaById(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
    return this.informacionService.GetCategoriaById(id);
  }

  @Patch('categorias/:id')
  async updateCategoria(@Param('id', ParseIntPipe) id: number, @Body() updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    return this.informacionService.updateCategoria(id, updateCategoriaDto);
  }

  @Delete('categorias/:id')
  async removeCategoria(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    const isDeleted = await this.informacionService.removeCategoria(id);
    if (!isDeleted) {
      throw new HttpException('Categoría no encontrada para eliminar', HttpStatus.NOT_FOUND);
    }
    return { message: `Categoría con ID ${id} eliminada correctamente` };
  }
}
