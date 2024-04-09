/*
  Warnings:

  - Made the column `dateFirstContact` on table `lead` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `lead` MODIFY `dateFirstContact` DATE NOT NULL;
