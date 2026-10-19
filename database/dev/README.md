# Entorno local de integración OE4

Estos archivos son exclusivos de desarrollo. No representan el esquema de
producción y no deben ejecutarse sobre servicios institucionales.

El backend obtiene su conexión de `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
y `DB_NAME`. No tiene credenciales de conexión de respaldo. `.env.example`
contiene un ejemplo sin contraseña y `.env` está ignorado por Git.

Para una prueba aislada, crear un contenedor nuevo de MySQL 8.4 con la base
`cacpj_oe4_dev`. Publicar MySQL solo en `127.0.0.1`, con un puerto libre, y generar
contraseñas aleatorias fuera del repositorio. Pasar `MYSQL_DATABASE`, `MYSQL_USER`,
`MYSQL_PASSWORD` y `MYSQL_ROOT_PASSWORD` mediante un archivo temporal con permisos
restringidos y la opción Docker `--env-file`. No escribir contraseñas en comandos,
capturas, archivos versionados ni logs. La cuenta del backend necesita permisos
únicamente sobre esta base sintética.

Con el contenedor listo, preparar otro archivo temporal protegido con las cinco
variables `DB_*` correspondientes y `NODE_ENV=test`. Ejecutar desde la raíz:

```sh
npm run build
node --env-file=/ruta/temporal/oe4-local.env test/oe4-local.integration.cjs
npm test -- --runInBand
```

Usar Node.js 24 para esta integración. En Node.js 26, la dependencia existente
`buffer-equal-constant-time`, utilizada por el JWT, falla al cargar porque espera
`buffer.SlowBuffer`. La compilación y las pruebas con mocks no detectaban ese
problema de arranque. Esta fase no modifica autenticación ni dependencias para
resolverlo: utiliza el runtime compatible instalado.

El runner exige una dirección loopback literal (`127.0.0.1` o `::1`), el nombre
exacto `cacpj_oe4_dev`, `NODE_ENV=test` y una base inicialmente vacía. Si hay tablas,
se detiene sin borrarlas. No utiliza `.env` para decidir su conexión inicial.

Orden de preparación automático:

1. `oe4_dev_bootstrap.sql`: tabla mínima `usuarios`, compatible con la entidad
   existente, sin usuarios predefinidos.
2. Verificación de `usuarios.id` como `INT` con signo, PK, y motor InnoDB.
3. `../oe4_kri_auditoria.sql`: esquema original de las tres tablas OE4, sin cambios.
4. `oe4_dev_seed.sql`: tres indicadores sintéticos (dos activos y uno inactivo),
   cuatro resultados, dos períodos y distintas clasificaciones. Incluye un BIGINT
   superior al máximo entero seguro de JavaScript para verificar precisión.
5. Cuenta sintética `OE4_PRUEBA_LOCAL`, con contraseña generada en memoria y hash
   bcrypt en MySQL. La contraseña y el JWT no se imprimen ni se guardan en Git.

La prueba carga el `AppModule` real mediante `ts-node` y `tsconfig-paths`, ya
disponibles en el proyecto, para resolver sus imports existentes con prefijo
`src/`. No cambia la arquitectura ni usa repositorios simulados. Levanta Nest en
un puerto HTTP libre de `127.0.0.1`, aplica el mismo `ValidationPipe` de `main.ts`
y utiliza el login y los guards existentes. No ejecuta rutas de correo ni módulos
funcionales ajenos a OE4.

Comprueba filtros, autenticación, validación, precisión de resultados, auditorías
persistidas, unicidad de indicador/período y conservación de auditorías al borrar
el usuario. Esta última comprobación usa una transacción que revierte el borrado.
El servidor y sus conexiones se cierran al finalizar. Las tablas y datos sintéticos
permanecen en el contenedor hasta que se retire el entorno local; el runner no
elimina tablas ni permite reutilizar inadvertidamente una base poblada.

Detener y eliminar únicamente el contenedor dedicado cuando termine la revisión.
No usar el antiguo `test/app.e2e-spec.ts` como prueba OE4: sigue siendo el ejemplo
inicial de Nest y espera una ruta raíz que este backend no implementa.
