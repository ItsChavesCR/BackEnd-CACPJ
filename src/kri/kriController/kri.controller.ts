import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { isIP } from 'net';
import { DetalleAuditoria } from '../../auditoria/auditoriaDto/registrar-accion.dto';
import { AuditoriaService } from '../../auditoria/auditoriaServices/auditoria.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FiltroResultadosKriDto } from '../kriDto/filtro-resultados-kri.dto';
import { KriService } from '../kriServices/kri.service';

type SolicitudAutenticada = Request & { user?: { userId?: unknown } };
type AccionConsultaKri =
  | 'CONSULTAR_INDICADORES_KRI'
  | 'CONSULTAR_RESULTADOS_KRI';

@Controller('kri')
@UseGuards(JwtAuthGuard)
export class KriController {
  constructor(
    private readonly kriService: KriService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Get()
  async findIndicadoresActivos(@Req() request: SolicitudAutenticada) {
    const indicadores = await this.kriService.findIndicadoresActivos();
    await this.registrarConsulta(request, 'CONSULTAR_INDICADORES_KRI');
    return indicadores;
  }

  @Get('resultados')
  async findResultados(
    @Query() filtros: FiltroResultadosKriDto,
    @Req() request: SolicitudAutenticada,
  ) {
    const resultados = await this.kriService.findResultados(filtros);
    await this.registrarConsulta(request, 'CONSULTAR_RESULTADOS_KRI');
    return resultados;
  }

  private registrarConsulta(
    request: SolicitudAutenticada,
    accion: AccionConsultaKri,
  ) {
    // JwtStrategy entrega userId desde payload.sub, no desde payload.area.
    const userId = request.user?.userId;
    const id =
      typeof userId === 'number'
        ? userId
        : typeof userId === 'string' && /^[1-9]\d*$/.test(userId)
          ? Number(userId)
          : null;
    // La autenticación heredada puede emitir identidades sin usuario en MySQL.
    const idUsuario =
      id !== null && Number.isSafeInteger(id) && id > 0 && id <= 2147483647
        ? id
        : null;
    const remoteAddress = request.socket?.remoteAddress;

    return this.auditoriaService.registrarAccion({
      idUsuario,
      accion,
      modulo: 'DASHBOARD',
      entidad:
        accion === 'CONSULTAR_INDICADORES_KRI' ? 'IndicadorKri' : 'ResultadoKri',
      detalle:
        accion === 'CONSULTAR_INDICADORES_KRI'
          ? DetalleAuditoria.CONSULTA_INDICADORES_KRI
          : DetalleAuditoria.CONSULTA_RESULTADOS_KRI,
      resultado: 'EXITOSO',
      // Ignorar X-Forwarded-For: no hay proxies de confianza configurados.
      direccionIp: remoteAddress && isIP(remoteAddress) ? remoteAddress : null,
    });
  }
}
