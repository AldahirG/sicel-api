/*
  Warnings:

  - You are about to drop the column `CURP` on the `enrollments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `enrollments` DROP COLUMN `CURP`,
    ADD COLUMN `curp` VARCHAR(191) NULL,
    ADD COLUMN `scholarship` VARCHAR(191) NULL;
