// archivo: creditoController/credito.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreditoService } from '../creditoServices/credito.service';

@Controller('credito')
export class CreditoController {
  constructor(private readonly creditoService: CreditoService) {}

  @Post('calcular-cuota')
  async calcularCuota(
    @Body('Id_TipoCredito') Id_TipoCredito: number,
    @Body('Id_TipoGarantia') Id_TipoGarantia: number,
    @Body('Id_FuenteFondos') Id_FuenteFondos: number,
    @Body('monto') monto: number,
    @Body('plazo') plazo: number
  ): Promise<{ cuotaMensual: number }> {
    const cuotaMensual = await this.creditoService.calcularCuotaMensual(
      Id_TipoCredito,  // Pasamos los parámetros correctos al servicio
      Id_TipoGarantia,
      Id_FuenteFondos,
      monto,
      plazo,
    );
  
    return { cuotaMensual };
  }


  /////////7
  @Get('fuentes-fondos')
  async getAllFuenteFondos(): Promise<any> {
    return await this.creditoService.getAllFuenteFondos();
  }
}
