/*
  Warnings:

  - You are about to drop the column `data_source` on the `lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `lead` DROP COLUMN `data_source`,
    ADD COLUMN `contactMediumId` INTEGER NULL,
    ADD COLUMN `dataSource` VARCHAR(40) NULL,
    ADD COLUMN `enrollmentStatus` VARCHAR(10) NULL;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_contactMediumId_fkey` FOREIGN KEY (`contactMediumId`) REFERENCES `ContactMedium`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
