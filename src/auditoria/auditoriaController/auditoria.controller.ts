import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FiltroAuditoriaDto } from '../auditoriaDto/filtro-auditoria.dto';
import { AuditoriaService } from '../auditoriaServices/auditoria.service';

@Controller('auditoria')
@UseGuards(JwtAuthGuard)
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  findRegistros(@Query() filtros: FiltroAuditoriaDto) {
    return this.auditoriaService.findRegistros(filtros);
  }
}
