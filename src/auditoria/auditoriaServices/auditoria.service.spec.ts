import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  DetalleAuditoria,
  RegistrarAccionDto,
} from '../auditoriaDto/registrar-accion.dto';
import { AuditoriaAccion } from '../auditoriaEntities/auditoria-accion.entity';
import { AuditoriaService } from './auditoria.service';

describe('AuditoriaService', () => {
  let service: AuditoriaService;
  let repository: { create: jest.Mock; save: jest.Mock; find: jest.Mock };
  const datos: RegistrarAccionDto = {
    idUsuario: 7,
    accion: 'CONSULTAR_INDICADORES_KRI',
    modulo: 'DASHBOARD',
    resultado: 'EXITOSO',
  };

  beforeEach(() => {
    repository = {
      create: jest.fn((registro) => registro),
      save: jest.fn(async (registro) => registro),
      find: jest.fn().mockResolvedValue([]),
    };
    service = new AuditoriaService(
      repository as unknown as Repository<AuditoriaAccion>,
    );
  });

  it('conserva identificadores extensos y solo acepta detalle controlado', async () => {
    const registro = await service.registrarAccion({
      ...datos,
      entidad: 'ResultadoKri',
      idRegistro: '9007199254740993',
      detalle: DetalleAuditoria.CONSULTA_RESULTADOS_KRI,
      direccionIp: '2001:db8::1',
    });

    expect(registro.idRegistro).toBe('9007199254740993');
    expect(registro.detalle).toBe(DetalleAuditoria.CONSULTA_RESULTADOS_KRI);
    expect(registro.direccionIp).toBe('2001:db8::1');
    expect(registro).not.toHaveProperty('usuario');
  });

  it.each([
    'password',
    'jwt',
    'token',
    'recoveryCode',
    'credentials',
    'body',
    'headers',
  ])('rechaza campos ajenos al contrato: %s', async (campo) => {
    await expect(
      service.registrarAccion({ ...datos, [campo]: 'valor-de-prueba' }),
    ).rejects.toThrow(new BadRequestException('Datos de auditoría inválidos'));
    expect(repository.save).not.toHaveBeenCalled();
  });

  it.each([
    'Texto libre recibido del cliente',
    '{"password":"valor-de-prueba"}',
    'Bearer valor-de-prueba',
  ])('rechaza detalle arbitrario sin persistirlo: %s', async (detalle) => {
    await expect(
      service.registrarAccion({
        ...datos,
        detalle: detalle as DetalleAuditoria,
      }),
    ).rejects.toThrow('Datos de auditoría inválidos');
    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('permite registros sin usuario y sin detalles opcionales', async () => {
    const registro = await service.registrarAccion({
      accion: datos.accion,
      modulo: datos.modulo,
      resultado: datos.resultado,
    });

    expect(registro.idUsuario).toBeNull();
    expect(registro.detalle).toBeNull();
  });

  it('consulta con parámetros y sin cargar credenciales de Usuario', async () => {
    await service.findRegistros({
      idUsuario: 7,
      modulo: "DASHBOARD' OR 1=1 --",
      accion: datos.accion,
    });

    expect(repository.find).toHaveBeenCalledWith({
      where: {
        idUsuario: 7,
        modulo: "DASHBOARD' OR 1=1 --",
        accion: datos.accion,
      },
      order: { fechaHora: 'DESC', idAuditoria: 'DESC' },
    });
  });
});
