-- DropForeignKey
ALTER TABLE `lead` DROP FOREIGN KEY `Lead_campaignId_fkey`;

-- DropForeignKey
ALTER TABLE `lead` DROP FOREIGN KEY `Lead_carreerId_fkey`;

-- DropForeignKey
ALTER TABLE `lead` DROP FOREIGN KEY `Lead_followId_fkey`;

-- DropForeignKey
ALTER TABLE `lead` DROP FOREIGN KEY `Lead_gradeId_fkey`;

-- DropForeignKey
ALTER TABLE `lead` DROP FOREIGN KEY `Lead_promoterId_fkey`;

-- AlterTable
ALTER TABLE `lead` MODIFY `campaignId` INTEGER NULL,
    MODIFY `followId` INTEGER NULL,
    MODIFY `gradeId` INTEGER NULL,
    MODIFY `carreerId` INTEGER NULL,
    MODIFY `promoterId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_followId_fkey` FOREIGN KEY (`followId`) REFERENCES `FollowUp`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_carreerId_fkey` FOREIGN KEY (`carreerId`) REFERENCES `Carreer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_promoterId_fkey` FOREIGN KEY (`promoterId`) REFERENCES `Promoter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
