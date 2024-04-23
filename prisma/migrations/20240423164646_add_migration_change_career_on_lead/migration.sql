/*
  Warnings:

  - You are about to drop the column `carreerId` on the `lead` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `lead` DROP FOREIGN KEY `Lead_carreerId_fkey`;

-- AlterTable
ALTER TABLE `lead` DROP COLUMN `carreerId`,
    ADD COLUMN `career` VARCHAR(100) NULL;
