/*
  Warnings:

  - You are about to drop the column `school_year` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the column `type_school` on the `lead` table. All the data in the column will be lost.
  - Added the required column `schoolYear` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeSchool` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lead` DROP COLUMN `school_year`,
    DROP COLUMN `type_school`,
    ADD COLUMN `schoolYear` VARCHAR(6) NOT NULL,
    ADD COLUMN `typeSchool` VARCHAR(100) NOT NULL;
