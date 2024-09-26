// src/envios/envios.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnviosService } from '../ganaderiaServices/envios.service';
import { CreateEnviosDto } from '../ganaderiaDto/create-envios.dto';
import { UpdateEnviosDto } from '../ganaderiaDto/update-envios.dto';

@Controller('envios')
export class EnviosController {
  constructor(private readonly enviosService: EnviosService) {}

  @Post()
  create(@Body() createEnviosDto: CreateEnviosDto) {
    return this.enviosService.create(createEnviosDto);
  }

  @Get()
  findAll() {
    return this.enviosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enviosService.findOne(+id);
  }

  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnviosDto: UpdateEnviosDto) {
    return this.enviosService.update(+id, updateEnviosDto);
  }
/*
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enviosService.remove(+id);
  }

  */
}
