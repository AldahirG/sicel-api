-- DropIndex
DROP INDEX `Campaign_name_key` ON `campaign`;

-- AlterTable
ALTER TABLE `campaign` MODIFY `status` INTEGER NOT NULL DEFAULT 1;
