-- OE4: estructuras de persistencia de indicadores KRI y auditoría.
-- Script para revisión y ejecución manual posterior; no ejecutado por la aplicación.
-- Ejecutar únicamente en el entorno autorizado, con el esquema correcto seleccionado.
-- Requiere que usuarios exista en InnoDB y usuarios.id sea INT con signo y PK,
-- de acuerdo con la entidad Usuario actual. Verificar antes de ejecutar; si difiere,
-- detenerse y revisar la FK. Este script no modifica usuarios ni otras tablas existentes.
-- No usa IF NOT EXISTS: una tabla preexistente debe revisarse antes de continuar.
-- MySQL realiza commits implícitos para DDL; estas sentencias no son atómicas.
-- DECIMAL(15,4) conserva cuatro decimales; BIGINT y DECIMAL se mapean a string en TS.

CREATE TABLE `indicador_kri` (
  `idIndicador` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `areaRiesgo` VARCHAR(255) NOT NULL,
  `ambito` VARCHAR(255) NOT NULL,
  `unidadMedida` VARCHAR(255) NOT NULL,
  `limite` DECIMAL(15,4) NULL,
  `alerta` DECIMAL(15,4) NULL,
  `aceptable` DECIMAL(15,4) NULL,
  `optimo` DECIMAL(15,4) NULL,
  `direccionRiesgo` VARCHAR(255) NULL,
  `tolerancia` VARCHAR(255) NULL,
  `activo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`idIndicador`),
  UNIQUE KEY `UQ_indicador_kri_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `resultado_kri` (
  `idResultado` BIGINT NOT NULL AUTO_INCREMENT,
  `idIndicador` INT NOT NULL,
  `periodo` VARCHAR(255) NOT NULL,
  `valor` DECIMAL(15,4) NOT NULL,
  `clasificacion` VARCHAR(255) NOT NULL,
  `fechaCalculo` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idResultado`),
  UNIQUE KEY `UQ_resultado_kri_indicador_periodo` (`idIndicador`, `periodo`),
  KEY `IDX_resultado_kri_indicador` (`idIndicador`),
  KEY `IDX_resultado_kri_periodo` (`periodo`),
  KEY `IDX_resultado_kri_clasificacion` (`clasificacion`),
  CONSTRAINT `FK_resultado_kri_indicador`
    FOREIGN KEY (`idIndicador`) REFERENCES `indicador_kri` (`idIndicador`)
    ON DELETE RESTRICT ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `auditoria_accion` (
  `idAuditoria` BIGINT NOT NULL AUTO_INCREMENT,
  `idUsuario` INT NULL,
  `accion` VARCHAR(255) NOT NULL,
  `modulo` VARCHAR(255) NOT NULL,
  `entidad` VARCHAR(255) NULL,
  `idRegistro` VARCHAR(255) NULL,
  `detalle` TEXT NULL,
  `resultado` VARCHAR(255) NOT NULL,
  `direccionIp` VARCHAR(45) NULL,
  `fechaHora` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idAuditoria`),
  KEY `IDX_auditoria_accion_usuario` (`idUsuario`),
  KEY `IDX_auditoria_accion_fecha` (`fechaHora`),
  KEY `IDX_auditoria_accion_modulo` (`modulo`),
  KEY `IDX_auditoria_accion_accion` (`accion`),
  CONSTRAINT `FK_auditoria_accion_usuario`
    FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`)
    ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
