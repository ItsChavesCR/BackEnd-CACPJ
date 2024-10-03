import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
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
}
