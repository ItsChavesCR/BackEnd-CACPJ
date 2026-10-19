-- DATOS SINTÉTICOS DE PRUEBA. SOLO DESARROLLO LOCAL OE4.
-- Requiere usuarios y las tres tablas OE4 en cacpj_oe4_dev, inicialmente vacías.
-- El usuario sintético y su contraseña se generan en memoria durante la prueba.
INSERT INTO `indicador_kri`
  (`idIndicador`, `nombre`, `areaRiesgo`, `ambito`, `unidadMedida`,
   `limite`, `alerta`, `aceptable`, `optimo`, `direccionRiesgo`, `activo`)
VALUES
  (1, 'PRUEBA OE4 A', 'PRUEBA', 'LOCAL', 'porcentaje',
   90.0000, 70.0000, 40.0000, 10.0000, 'ASCENDENTE', 1),
  (2, 'PRUEBA OE4 B', 'PRUEBA', 'LOCAL', 'unidades',
   100.0000, 80.0000, 50.0000, 20.0000, 'ASCENDENTE', 1),
  (3, 'PRUEBA OE4 INACTIVO', 'PRUEBA', 'LOCAL', 'unidades',
   NULL, NULL, NULL, NULL, NULL, 0);

INSERT INTO `resultado_kri`
  (`idResultado`, `idIndicador`, `periodo`, `valor`, `clasificacion`)
VALUES
  (1, 1, 'PRUEBA-2026-08', 10.1234, 'OPTIMO'),
  (2, 1, 'PRUEBA-2026-09', 75.5000, 'ALERTA'),
  (3, 2, 'PRUEBA-2026-08', 25.0000, 'ACEPTABLE'),
  (9007199254740993, 2, 'PRUEBA-2026-09', 85.2500, 'ALERTA');
