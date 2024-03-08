-- CreateTable
CREATE TABLE `Lead` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `tel` VARCHAR(10) NOT NULL,
    `telOptional` VARCHAR(10) NULL,
    `email` VARCHAR(80) NOT NULL,
    `emailOptional` VARCHAR(80) NULL,
    `genre` VARCHAR(50) NOT NULL,
    `dateFirstContact` VARCHAR(10) NOT NULL,
    `dateBirth` VARCHAR(10) NOT NULL,
    `formerSchool` VARCHAR(100) NOT NULL,
    `country` VARCHAR(60) NOT NULL,
    `state` VARCHAR(60) NOT NULL,
    `city` VARCHAR(60) NOT NULL,
    `academicYear` VARCHAR(10) NOT NULL,
    `asetNameForm` VARCHAR(150) NOT NULL,
    `isOrganic` VARCHAR(10) NOT NULL,
    `referenceType` VARCHAR(50) NOT NULL,
    `referenceName` VARCHAR(150) NOT NULL,
    `enrollmentDate` VARCHAR(10) NOT NULL,
    `scholarship` VARCHAR(60) NOT NULL,
    `enrollmentStatus` VARCHAR(10) NOT NULL,
    `admissionSemester` VARCHAR(20) NOT NULL,
    `dateAssigmentPromotor` VARCHAR(10) NOT NULL,
    `campaignId` INTEGER NOT NULL,
    `followId` INTEGER NOT NULL,
    `gradeId` INTEGER NOT NULL,
    `carreerId` INTEGER NOT NULL,
    `promoterId` INTEGER NOT NULL,

    UNIQUE INDEX `Lead_email_key`(`email`),
    UNIQUE INDEX `Lead_emailOptional_key`(`emailOptional`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_followId_fkey` FOREIGN KEY (`followId`) REFERENCES `FollowUp`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_carreerId_fkey` FOREIGN KEY (`carreerId`) REFERENCES `Carreer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_promoterId_fkey` FOREIGN KEY (`promoterId`) REFERENCES `Promoter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
