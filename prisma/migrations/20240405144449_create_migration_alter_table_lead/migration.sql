/*
  Warnings:

  - A unique constraint covering the columns `[tel]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `school_year` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_school` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Lead_emailOptional_key` ON `lead`;

-- AlterTable
ALTER TABLE `lead` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `school_year` VARCHAR(6) NOT NULL,
    ADD COLUMN `type_school` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Lead_tel_key` ON `Lead`(`tel`);
