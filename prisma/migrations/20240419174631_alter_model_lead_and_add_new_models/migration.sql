/*
  Warnings:

  - You are about to drop the column `asetNameForm` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the column `dateBirth` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the column `enrollmentDate` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the column `enrollmentStatus` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the column `isOrganic` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the column `scholarship` on the `lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `lead` DROP COLUMN `asetNameForm`,
    DROP COLUMN `dateBirth`,
    DROP COLUMN `enrollmentDate`,
    DROP COLUMN `enrollmentStatus`,
    DROP COLUMN `isOrganic`,
    DROP COLUMN `scholarship`,
    ADD COLUMN `asetNameId` INTEGER NULL,
    ADD COLUMN `data_source` VARCHAR(40) NULL;

-- CreateTable
CREATE TABLE `ContactMedium` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AsetName` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NOT NULL,
    `mediumId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AsetName` ADD CONSTRAINT `AsetName_mediumId_fkey` FOREIGN KEY (`mediumId`) REFERENCES `ContactMedium`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_asetNameId_fkey` FOREIGN KEY (`asetNameId`) REFERENCES `AsetName`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
