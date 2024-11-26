/*
  Warnings:

  - You are about to drop the column `usaurioCargaId` on the `producto` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `producto` DROP FOREIGN KEY `Producto_usaurioCargaId_fkey`;

-- AlterTable
ALTER TABLE `producto` DROP COLUMN `usaurioCargaId`,
    ADD COLUMN `activo` BOOLEAN NULL,
    ADD COLUMN `cantStock` INTEGER NULL,
    ADD COLUMN `precioUnitario` DECIMAL(65, 30) NULL,
    ADD COLUMN `usuarioCargaId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_usuarioCargaId_fkey` FOREIGN KEY (`usuarioCargaId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
