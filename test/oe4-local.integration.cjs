// Integración real y optativa. Solo se permite una base local vacía de desarrollo.
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { readFile } = require('node:fs/promises');
const { isIP } = require('node:net');
const path = require('node:path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const root = path.resolve(__dirname, '..');

async function main() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  assert.ok(
    ['127.0.0.1', '::1'].includes(DB_HOST),
    'La integración solo admite una dirección loopback literal',
  );
  assert.equal(DB_NAME, 'cacpj_oe4_dev', 'Se requiere la base aislada de OE4');
  assert.ok(
    DB_USER && DB_PASSWORD,
    'Faltan credenciales locales de desarrollo',
  );
  assert.ok(
    /^\d+$/.test(DB_PORT || '') &&
      Number(DB_PORT) > 0 &&
      Number(DB_PORT) <= 65535,
    'Puerto local inválido',
  );
  assert.equal(
    process.env.NODE_ENV,
    'test',
    'Ejecutar explícitamente con NODE_ENV=test',
  );

  // No cargar AppModule hasta haber validado la conexión local.
  require('ts-node').register({ project: path.join(root, 'tsconfig.json') });
  require('tsconfig-paths/register');
  const { NestFactory } = require('@nestjs/core');
  const { ValidationPipe } = require('@nestjs/common');
  const { AppModule } = require('../src/app.module');

  let connection;
  let app;
  let httpCases = 0;
  let sqlCases = 0;
  let jwt;

  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      connectTimeout: 5000,
      multipleStatements: true,
      supportBigNumbers: true,
      bigNumberStrings: true,
    });
    const [tables] = await connection.query('SHOW TABLES');
    assert.equal(
      tables.length,
      0,
      'La base debe estar vacía; no se borrarán tablas',
    );

    await connection.query(
      await readFile(
        path.join(root, 'database/dev/oe4_dev_bootstrap.sql'),
        'utf8',
      ),
    );
    const [columns] = await connection.execute(
      'SELECT COLUMN_TYPE, COLUMN_KEY, IS_NULLABLE FROM information_schema.COLUMNS ' +
        'WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?',
      [DB_NAME, 'usuarios', 'id'],
    );
    assert.equal(columns[0].COLUMN_TYPE, 'int');
    assert.equal(columns[0].COLUMN_KEY, 'PRI');
    assert.equal(columns[0].IS_NULLABLE, 'NO');
    const [engines] = await connection.execute(
      'SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
      [DB_NAME, 'usuarios'],
    );
    assert.equal(engines[0].ENGINE, 'InnoDB');
    console.log('FK usuarios verificada: INT con signo, PK e InnoDB');

    await connection.query(
      await readFile(path.join(root, 'database/oe4_kri_auditoria.sql'), 'utf8'),
    );
    await connection.query(
      await readFile(path.join(root, 'database/dev/oe4_dev_seed.sql'), 'utf8'),
    );

    // La contraseña del usuario de la aplicación solo existe en memoria.
    const password = randomBytes(32).toString('base64url');
    const area = 'OE4_PRUEBA_LOCAL';
    const hash = await bcrypt.hash(password, 10);
    const [inserted] = await connection.execute(
      'INSERT INTO usuarios (area, password) VALUES (?, ?)',
      [area, hash],
    );
    const userId = inserted.insertId;

    // AppModule real, sin mocks. Mismo ValidationPipe que main.ts.
    // Solo escucha en loopback y en un puerto libre asignado por el sistema.
    app = await NestFactory.create(AppModule, {
      logger: false,
      abortOnError: false,
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.listen(0, '127.0.0.1');
    const baseUrl = await app.getUrl();

    async function request(method, route, status, body, authenticated = true) {
      const response = await fetch(`${baseUrl}${route}`, {
        method,
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(authenticated ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(15000),
      });
      assert.equal(response.status, status, `${method} ${route}`);
      httpCases++;
      console.log(`${method} ${route} -> ${response.status}`);
      return response.json();
    }

    const login = await request(
      'POST',
      '/auth/login',
      201,
      { area, password },
      false,
    );
    assert.equal(typeof login.access_token, 'string');
    assert.ok(login.access_token.length > 0);
    jwt = login.access_token;
    console.log('JWT obtenido correctamente (valor omitido)');

    await request('GET', '/kri', 401, undefined, false);
    const indicadores = await request('GET', '/kri', 200);
    assert.deepEqual(
      indicadores.map((item) => item.idIndicador),
      [1, 2],
    );
    assert.ok(indicadores.every((item) => item.activo === true));

    const resultados = await request('GET', '/kri/resultados', 200);
    assert.equal(resultados.length, 4);
    assert.ok(
      resultados.every(
        (item) => item.indicador.idIndicador === item.idIndicador,
      ),
    );
    assert.equal(
      resultados.find((item) => item.idResultado === '1').valor,
      '10.1234',
    );
    assert.ok(
      resultados.some((item) => item.idResultado === '9007199254740993'),
    );

    const periodo = await request(
      'GET',
      '/kri/resultados?periodo=PRUEBA-2026-08',
      200,
    );
    assert.equal(periodo.length, 2);
    assert.ok(periodo.every((item) => item.periodo === 'PRUEBA-2026-08'));

    const indicador = await request(
      'GET',
      '/kri/resultados?idIndicador=1',
      200,
    );
    assert.equal(indicador.length, 2);
    assert.ok(indicador.every((item) => item.idIndicador === 1));

    const clasificacion = await request(
      'GET',
      '/kri/resultados?clasificacion=ALERTA',
      200,
    );
    assert.equal(clasificacion.length, 2);
    assert.ok(clasificacion.every((item) => item.clasificacion === 'ALERTA'));

    await request('GET', '/kri/resultados?idIndicador=invalido', 400);
    assert.deepEqual(
      await request('GET', '/kri/resultados?periodo=PRUEBA-SIN-DATOS', 200),
      [],
    );
    const combinacion = await request(
      'GET',
      '/kri/resultados?idIndicador=1&periodo=PRUEBA-2026-09&clasificacion=ALERTA',
      200,
    );
    assert.equal(combinacion.length, 1);
    assert.equal(combinacion[0].idResultado, '2');

    const registros = await request('GET', '/auditoria', 200);
    assert.equal(registros.length, 7);
    for (const item of registros) {
      assert.equal(item.idUsuario, userId);
      assert.ok(
        ['CONSULTAR_INDICADORES_KRI', 'CONSULTAR_RESULTADOS_KRI'].includes(
          item.accion,
        ),
      );
      assert.equal(item.modulo, 'DASHBOARD');
      assert.equal(item.resultado, 'EXITOSO');
      assert.ok(!Number.isNaN(Date.parse(item.fechaHora)));
      assert.ok(isIP(item.direccionIp));
      assert.ok(!('usuario' in item));
    }
    for (let i = 1; i < registros.length; i++) {
      assert.ok(
        Date.parse(registros[i - 1].fechaHora) >=
          Date.parse(registros[i].fechaHora),
      );
    }
    const filtrados = await request(
      'GET',
      `/auditoria?idUsuario=${userId}&modulo=DASHBOARD&accion=CONSULTAR_RESULTADOS_KRI`,
      200,
    );
    assert.equal(filtrados.length, 6);
    await request('GET', '/auditoria', 401, undefined, false);

    const [persistidos] = await connection.execute(
      'SELECT a.idAuditoria, a.idUsuario, a.accion, a.modulo, a.resultado, ' +
        'a.fechaHora, a.direccionIp, a.detalle FROM auditoria_accion a ' +
        'INNER JOIN usuarios u ON u.id = a.idUsuario WHERE u.area = ?',
      [area],
    );
    assert.equal(persistidos.length, 7);
    assert.ok(
      persistidos.every(
        (item) => item.idUsuario === userId && isIP(item.direccionIp),
      ),
    );
    const serialized = JSON.stringify(persistidos);
    assert.ok(!serialized.includes(jwt));
    assert.ok(!serialized.includes(password));
    assert.ok(!serialized.includes(DB_PASSWORD));
    sqlCases++;
    console.log(
      'MySQL: 7 auditorías persistidas, con usuario e IP, sin credenciales',
    );

    await assert.rejects(
      connection.execute(
        'INSERT INTO resultado_kri (idIndicador, periodo, valor, clasificacion) VALUES (?, ?, ?, ?)',
        [1, 'PRUEBA-2026-08', '1.0000', 'PRUEBA'],
      ),
      { code: 'ER_DUP_ENTRY' },
    );
    sqlCases++;
    console.log('MySQL: unicidad de indicador y periodo comprobada');

    await connection.beginTransaction();
    try {
      await connection.execute('DELETE FROM usuarios WHERE id = ?', [userId]);
      const [conservados] = await connection.query(
        'SELECT idUsuario FROM auditoria_accion',
      );
      assert.equal(conservados.length, 7);
      assert.ok(conservados.every((item) => item.idUsuario === null));
      sqlCases++;
      console.log(
        'MySQL: ON DELETE SET NULL conserva auditorías (prueba revertida)',
      );
    } finally {
      await connection.rollback();
    }

    console.log(
      `Integración OE4 aprobada: ${httpCases} casos HTTP y ${sqlCases} comprobaciones SQL`,
    );
  } finally {
    if (app) await app.close();
    if (connection) await connection.end();
  }
}

main().catch((error) => {
  // No volcar objetos de conexión, peticiones, SQL con parámetros ni JWT.
  console.error(
    'Integración OE4 fallida:',
    error.code || error.name,
    error.message,
  );
  process.exitCode = 1;
});
