/*
  Warnings:

  - You are about to alter the column `dateFirstContact` on the `lead` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Date`.
  - You are about to alter the column `dateBirth` on the `lead` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Date`.
  - You are about to alter the column `enrollmentDate` on the `lead` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Date`.

*/
-- AlterTable
ALTER TABLE `lead` MODIFY `dateFirstContact` DATE NULL,
    MODIFY `dateBirth` DATE NOT NULL,
    MODIFY `enrollmentDate` DATE NOT NULL;
