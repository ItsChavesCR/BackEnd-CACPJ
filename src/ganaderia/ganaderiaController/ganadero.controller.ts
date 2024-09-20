// src/ganadero/ganadero.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateGanaderoDto } from '../ganaderiaDto/create-ganadero.dto';
import { GanaderoService } from '../ganaderiaServices/ganadero.service';


@Controller('ganadero')
export class GanaderoController {
  constructor(private readonly ganaderoService: GanaderoService) {}

  @Post()
  create(@Body() createGanaderoDto: CreateGanaderoDto) {
    return this.ganaderoService.create(createGanaderoDto);
  }

  @Get()
  findAll() {
    return this.ganaderoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ganaderoService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGanaderoDto: UpdateGanaderoDto) {
  //   return this.ganaderoService.update(+id, updateGanaderoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ganaderoService.remove(+id);
  // }
}
