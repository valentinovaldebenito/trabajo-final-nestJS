-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `rol` ENUM('SUPERADMIN', 'ADMIN', 'COMUN') NULL;