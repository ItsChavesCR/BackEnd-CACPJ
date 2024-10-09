import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, ConflictException, BadRequestException } from '@nestjs/common';
import { TipoCreditoService } from '../creditoServices/tipo_credito.service';
import { CreateTipoCreditoDto } from '../creditoDto/create-tipoCredito.dto';
import { TipoCredito } from '../CreditoEntities/tipo_credito.entity';
import { UpdateTipoCreditoDto } from '../creditoDto/update-tipoCredito.dto';
@Controller('tipo_credito')
export class TipoCreditoController {

  constructor(private readonly tipoCreditoService: TipoCreditoService) {}

  @Get()
  getTipoCredito(): Promise<TipoCredito[]>{
    return this.tipoCreditoService.getTipoCredito();
  }

  @Get(':id')
  getTipoCreditoById(@Param('id', ParseIntPipe) id: number): Promise<TipoCredito> { 
    console.log(id)
    console.log(typeof id)
    return this.tipoCreditoService.getTipoCreditoById(id);
  }

  @Post()
  async create(@Body() createTipoCreditoDto: CreateTipoCreditoDto): Promise<{ message: string, data: TipoCredito }> {
    try {
      const tipoCredito = await this.tipoCreditoService.createTipoCredito(createTipoCreditoDto);
      return {
        message: 'Tipo de crédito agregado exitosamente',
        data: tipoCredito,
      };
    } catch (error) {
      // Manejo específico de errores según el mensaje de la excepción
      if (error.message.includes('Ya existe un tipo de crédito con el nombre')) {
        throw new ConflictException(error.message);
      }
      if (error.message.includes('Todos los campos son obligatorios')) {
        throw new BadRequestException(error.message);
      }
      // Manejo genérico para otros errores
      throw new BadRequestException('Ha ocurrido un error al crear el tipo de crédito.');
    }
  }
  

  @Delete(':id')
   deleteTipoCredito(@Param('id', ParseIntPipe) id: number) {
    return this.tipoCreditoService.deleteTipoCredito(id);
  }


  @Patch(':id')
  updateTipoCredito(@Param('id', ParseIntPipe) id: number, @Body() TipoCredito: UpdateTipoCreditoDto){
    return this.tipoCreditoService.updateTipoCredito(id, TipoCredito);
  }

}