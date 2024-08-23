import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
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
  create(@Body() createTipoCreditoDto: CreateTipoCreditoDto): Promise<TipoCredito> {
    return this.tipoCreditoService.createTipoCredito(createTipoCreditoDto);
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