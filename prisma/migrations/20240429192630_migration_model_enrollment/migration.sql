-- CreateTable
CREATE TABLE `Enrollment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentDate` VARCHAR(10) NOT NULL,
    `scholarship` VARCHAR(50) NOT NULL,
    `enrollmentPromotion` VARCHAR(60) NOT NULL,
    `salesChannel` VARCHAR(30) NOT NULL,
    `leadId` INTEGER NOT NULL,
    `careerId` INTEGER NOT NULL,

    UNIQUE INDEX `Enrollment_leadId_key`(`leadId`),
    UNIQUE INDEX `Enrollment_careerId_key`(`careerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_careerId_fkey` FOREIGN KEY (`careerId`) REFERENCES `Carreer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
