/*
  Warnings:

  - You are about to drop the column `promoterId` on the `lead` table. All the data in the column will be lost.
  - You are about to drop the `promoter` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `lead` DROP FOREIGN KEY `Lead_promoterId_fkey`;

-- DropForeignKey
ALTER TABLE `promoter` DROP FOREIGN KEY `Promoter_userID_fkey`;

-- AlterTable
ALTER TABLE `lead` DROP COLUMN `promoterId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `promoter`;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
