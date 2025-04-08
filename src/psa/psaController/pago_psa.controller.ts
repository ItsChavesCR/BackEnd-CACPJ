import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PagoPsaService } from '../psaServices/pago_psa.service';
import { PagoPsa } from '../psaEntities/pago_psa.entity';


@Controller('pagos')
export class PagoPsaController {
    constructor(private readonly pagoPsaService: PagoPsaService) { }

    @Post('psa/:id')
    async agregarPago(
        @Param('id', ParseIntPipe) idPsa: number,
        @Body() pago: { Numero_Pago: string, Fecha_Pago: Date },  // Un solo pago
    ): Promise<PagoPsa> {
        return this.pagoPsaService.agregarPago(idPsa, pago);
    }

    // Endpoint para obtener los pagos por cédula
    @Get('cedula/:cedula')
    async getPagosByCedula(@Param('cedula') cedula: string): Promise<{ nombre: string, pagos: any[] }> {
        return this.pagoPsaService.getPagosByCedula(cedula);
    }

    // Endpoint para obtener los pagos por ID de PSA
    @Get('psa/:id')
    async getPagosByIdPsa(@Param('id', ParseIntPipe) idPsa: number): Promise<{ nombre: string, pagos: any[] }> {
        return this.pagoPsaService.getPagosByIdPsa(idPsa);
    }


    // Nuevo endpoint para eliminar un pago por su Numero_Pago
    @Delete(':idPsa/pago/:numeroPago')
    async eliminarPago(
        @Param('idPsa', ParseIntPipe) idPsa: number,
        @Param('numeroPago', ParseIntPipe) numeroPago: number,
    ): Promise<void> {
        return this.pagoPsaService.eliminarPago(idPsa, numeroPago);
    }

      // Endpoint para editar un pago
      @Patch(':idPsa/pago/:numeroPago')
      async editarPago(
          @Param('idPsa', ParseIntPipe) idPsa: number,
          @Param('numeroPago', ParseIntPipe) numeroPago: number,
          @Body() pagoActualizado: { Fecha_Pago: Date },
      ): Promise<PagoPsa> {
          return this.pagoPsaService.editarPago(idPsa, numeroPago, pagoActualizado);
      }
}

