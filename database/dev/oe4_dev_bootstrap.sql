-- SOLO DESARROLLO LOCAL OE4. NO es el esquema de producción.
-- Ejecutar únicamente dentro de una base cacpj_oe4_dev vacía y aislada.
-- Tabla mínima compatible con src/auth/loginEntities/login.entity.ts.
-- No contiene cuentas, contraseñas, hashes ni datos institucionales.
CREATE TABLE `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `area` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
