-- DropIndex
DROP INDEX `Lead_email_key` ON `lead`;

-- DropIndex
DROP INDEX `Lead_tel_key` ON `lead`;

-- AlterTable
ALTER TABLE `lead` MODIFY `tel` VARCHAR(25) NOT NULL,
    MODIFY `telOptional` VARCHAR(25) NULL,
    MODIFY `created_at` VARCHAR(35) NOT NULL,
    MODIFY `updated_at` VARCHAR(35) NOT NULL;
