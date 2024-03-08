/*
  Warnings:

  - You are about to drop the column `academicYear` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the column `dateAssigmentPromotor` on the `lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `lead` DROP COLUMN `academicYear`,
    DROP COLUMN `dateAssigmentPromotor`,
    MODIFY `dateFirstContact` VARCHAR(10) NULL;
