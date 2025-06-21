/*
  Warnings:

  - Added the required column `leadId` to the `Enrollments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `enrollments` ADD COLUMN `leadId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Enrollments` ADD CONSTRAINT `Enrollments_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
