-- DropForeignKey
ALTER TABLE `lead` DROP FOREIGN KEY `Lead_userId_fkey`;

-- AlterTable
ALTER TABLE `lead` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
