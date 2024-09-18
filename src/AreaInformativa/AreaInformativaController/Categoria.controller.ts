/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoriaService } from '../AreaInformativaServices/Categoria.service';
import { CreateCategoriaDto } from '../AreaInformativaDto/create-categoria.dto';
import { UpdateCategoriaDto } from '../AreaInformativaDto/update-categoria.dto';


@Controller('categorias')
export class CategoriaController {  // Nuevo controlador independiente
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  @Get()
  async findAll() {
    return this.categoriaService.GetAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.GetById(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriaService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.remove(id);
  }
}
