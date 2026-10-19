import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from 'express';
import { AuditoriaController } from '../../auditoria/auditoriaController/auditoria.controller';
import { FiltroAuditoriaDto } from '../../auditoria/auditoriaDto/filtro-auditoria.dto';
import { AuditoriaAccion } from '../../auditoria/auditoriaEntities/auditoria-accion.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FiltroResultadosKriDto } from '../kriDto/filtro-resultados-kri.dto';
import { IndicadorKri } from '../kriEntities/indicador-kri.entity';
import { ResultadoKri } from '../kriEntities/resultado-kri.entity';
import { KriModule } from '../kriModule/kri.module';
import { KriController } from './kri.controller';

function solicitud(userId: unknown = 7) {
  return {
    user: { userId },
    socket: { remoteAddress: '127.0.0.1' },
    headers: {
      authorization: 'Bearer valor-de-prueba',
      'x-forwarded-for': '203.0.113.10',
    },
    body: { password: 'valor-de-prueba' },
  } as unknown as Request & { user: { userId: unknown } };
}

describe('Consultas KRI y auditoría sin conexión MySQL', () => {
  let module: TestingModule;
  let controller: KriController;
  let indicadores: { find: jest.Mock };
  let resultados: { find: jest.Mock };
  let auditoria: { find: jest.Mock; create: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    indicadores = { find: jest.fn().mockResolvedValue([]) };
    resultados = { find: jest.fn().mockResolvedValue([]) };
    auditoria = {
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn((registro) => registro),
      save: jest.fn(async (registro) => registro),
    };

    // No importar AppModule ni registrar TypeOrmModule.forRoot.
    module = await Test.createTestingModule({ imports: [KriModule] })
      .overrideProvider(getRepositoryToken(IndicadorKri))
      .useValue(indicadores)
      .overrideProvider(getRepositoryToken(ResultadoKri))
      .useValue(resultados)
      .overrideProvider(getRepositoryToken(AuditoriaAccion))
      .useValue(auditoria)
      .compile();
    controller = module.get(KriController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('resuelve los módulos sin ciclos y protege ambos controllers con JWT', () => {
    expect(module.get(AuditoriaController)).toBeDefined();
    for (const tipo of [KriController, AuditoriaController]) {
      expect(Reflect.getMetadata(GUARDS_METADATA, tipo)).toContain(JwtAuthGuard);
    }
  });

  it('consulta solo activos y audita sin copiar información de la petición', async () => {
    indicadores.find.mockResolvedValue([{ idIndicador: 1, limite: '0.1234' }]);

    const respuesta = await controller.findIndicadoresActivos(solicitud('7'));

    expect(indicadores.find).toHaveBeenCalledWith({
      where: { activo: true },
      order: { nombre: 'ASC', idIndicador: 'ASC' },
    });
    expect(respuesta[0].limite).toBe('0.1234');
    expect(auditoria.save).toHaveBeenCalledTimes(1);
    const registro = auditoria.save.mock.calls[0][0];
    expect(registro).toMatchObject({
      idUsuario: 7,
      accion: 'CONSULTAR_INDICADORES_KRI',
      modulo: 'DASHBOARD',
      resultado: 'EXITOSO',
      direccionIp: '127.0.0.1',
    });
    expect(JSON.stringify(registro)).not.toContain('valor-de-prueba');
    expect(JSON.stringify(registro)).not.toContain('203.0.113.10');
  });

  it('filtra resultados con su indicador y conserva BIGINT y DECIMAL como strings', async () => {
    const filas = [
      {
        idResultado: '9007199254740993',
        valor: '99999999999.1234',
        indicador: { idIndicador: 7, alerta: '0.0001' },
      },
    ];
    resultados.find.mockResolvedValue(filas);
    const filtros = {
      idIndicador: 7,
      periodo: "2026-10' OR 1=1 --",
      clasificacion: 'ALERTA',
    };

    expect(await controller.findResultados(filtros, solicitud())).toEqual(filas);
    expect(resultados.find).toHaveBeenCalledWith({
      where: filtros,
      relations: { indicador: true },
      order: { periodo: 'DESC', idResultado: 'DESC' },
    });
    expect(auditoria.save.mock.calls[0][0].accion).toBe('CONSULTAR_RESULTADOS_KRI');
  });

  it('conserva la excepción de consulta y no registra un éxito falso', async () => {
    const error = new Error('Fallo de consulta de prueba');
    resultados.find.mockRejectedValue(error);

    await expect(controller.findResultados({}, solicitud())).rejects.toBe(error);
    expect(auditoria.save).not.toHaveBeenCalled();
  });

  it('no devuelve un éxito si falla la persistencia de auditoría', async () => {
    const error = new Error('Fallo de auditoría de prueba');
    auditoria.save.mockRejectedValue(error);

    await expect(
      controller.findIndicadoresActivos(solicitud()),
    ).rejects.toBe(error);
  });

  it.each(['identidad-heredada', '', 0, -1, 1.5, 2147483648, undefined])(
    'conserva la consulta sin fabricar una FK para identidad %s',
    async (userId) => {
      const request = solicitud();
      request.user.userId = userId;
      await controller.findIndicadoresActivos(request);

      expect(auditoria.save.mock.calls[0][0].idUsuario).toBeNull();
    },
  );
});

describe('DTOs con el ValidationPipe global', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  it('transforma IDs de query a enteros sin transformar resultados', async () => {
    const filtros = await pipe.transform(
      { idIndicador: '7', periodo: '2026-10', clasificacion: 'ALERTA' },
      { type: 'query', metatype: FiltroResultadosKriDto },
    );
    expect(filtros.idIndicador).toBe(7);
    expect(filtros.periodo).toBe('2026-10');
    const auditoria = await pipe.transform(
      { idUsuario: '7', modulo: 'DASHBOARD', accion: 'CONSULTAR_RESULTADOS_KRI' },
      { type: 'query', metatype: FiltroAuditoriaDto },
    );
    expect(auditoria.idUsuario).toBe(7);
  });

  it.each(['0', '-1', '1.5', 'abc', '', '2147483648', ['7']])(
    'rechaza un ID inválido: %s',
    async (idIndicador) => {
      await expect(
        pipe.transform(
          { idIndicador },
          { type: 'query', metatype: FiltroResultadosKriDto },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it.each([
    { periodo: ['2026-10', '2026-11'] },
    { periodo: '' },
    { clasificacion: {} },
    { clasificacion: 'a'.repeat(256) },
    { campoDesconocido: 'valor' },
  ])('rechaza filtros fuera del contrato: %j', async (query) => {
    await expect(
      pipe.transform(query, { type: 'query', metatype: FiltroResultadosKriDto }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('permite omitir todos los filtros en ambas consultas', async () => {
    for (const metatype of [FiltroResultadosKriDto, FiltroAuditoriaDto]) {
      await expect(
        pipe.transform({}, { type: 'query', metatype }),
      ).resolves.toEqual({});
    }
  });
});
