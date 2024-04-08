-- DropForeignKey
ALTER TABLE `lead` DROP FOREIGN KEY `Lead_carreerId_fkey`;

-- DropForeignKey
ALTER TABLE `lead` DROP FOREIGN KEY `Lead_followId_fkey`;

-- DropForeignKey
ALTER TABLE `lead` DROP FOREIGN KEY `Lead_gradeId_fkey`;

-- AlterTable
ALTER TABLE `lead` MODIFY `genre` VARCHAR(50) NULL,
    MODIFY `dateBirth` VARCHAR(10) NULL,
    MODIFY `formerSchool` VARCHAR(100) NULL,
    MODIFY `country` VARCHAR(60) NULL,
    MODIFY `state` VARCHAR(60) NULL,
    MODIFY `city` VARCHAR(60) NULL,
    MODIFY `asetNameForm` VARCHAR(150) NULL,
    MODIFY `isOrganic` VARCHAR(10) NULL,
    MODIFY `referenceType` VARCHAR(50) NULL,
    MODIFY `referenceName` VARCHAR(150) NULL,
    MODIFY `enrollmentDate` VARCHAR(10) NULL,
    MODIFY `scholarship` VARCHAR(60) NULL,
    MODIFY `enrollmentStatus` VARCHAR(10) NULL,
    MODIFY `admissionSemester` VARCHAR(20) NULL,
    MODIFY `followId` INTEGER NULL,
    MODIFY `gradeId` INTEGER NULL,
    MODIFY `carreerId` INTEGER NULL,
    MODIFY `created_at` VARCHAR(10) NOT NULL,
    MODIFY `schoolYear` VARCHAR(6) NULL,
    MODIFY `typeSchool` VARCHAR(100) NULL;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_followId_fkey` FOREIGN KEY (`followId`) REFERENCES `FollowUp`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_carreerId_fkey` FOREIGN KEY (`carreerId`) REFERENCES `Carreer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
