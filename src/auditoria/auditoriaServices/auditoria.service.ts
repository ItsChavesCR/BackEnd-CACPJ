import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FiltroAuditoriaDto } from '../auditoriaDto/filtro-auditoria.dto';
import { RegistrarAccionDto } from '../auditoriaDto/registrar-accion.dto';
import { AuditoriaAccion } from '../auditoriaEntities/auditoria-accion.entity';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(AuditoriaAccion)
    private readonly auditoriaRepository: Repository<AuditoriaAccion>,
  ) {}

  async registrarAccion(datos: RegistrarAccionDto): Promise<AuditoriaAccion> {
    // Esta validación también se aplica a llamadas internas, sin controller HTTP.
    const registro = plainToInstance(RegistrarAccionDto, datos);
    const errores = await validate(registro, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validationError: { target: false, value: false },
    });

    if (errores.length > 0) {
      throw new BadRequestException('Datos de auditoría inválidos');
    }

    // Proyección explícita: no copiar request, cabeceras, cuerpos ni usuarios.
    const accion = this.auditoriaRepository.create({
      idUsuario: registro.idUsuario ?? null,
      accion: registro.accion,
      modulo: registro.modulo,
      entidad: registro.entidad ?? null,
      idRegistro: registro.idRegistro ?? null,
      detalle: registro.detalle ?? null,
      resultado: registro.resultado,
      direccionIp: registro.direccionIp ?? null,
    });

    return this.auditoriaRepository.save(accion);
  }

  findRegistros(filtros: FiltroAuditoriaDto = {}): Promise<AuditoriaAccion[]> {
    const where: FindOptionsWhere<AuditoriaAccion> = {};

    if (filtros.idUsuario !== undefined) {
      where.idUsuario = filtros.idUsuario;
    }
    if (filtros.modulo !== undefined) {
      where.modulo = filtros.modulo;
    }
    if (filtros.accion !== undefined) {
      where.accion = filtros.accion;
    }

    // No cargar Usuario: sus credenciales no forman parte de esta respuesta.
    return this.auditoriaRepository.find({
      where,
      order: { fechaHora: 'DESC', idAuditoria: 'DESC' },
    });
  }
}
