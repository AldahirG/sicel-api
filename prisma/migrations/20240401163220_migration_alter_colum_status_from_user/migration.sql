/*
  Warnings:

  - Made the column `status` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `status` BOOLEAN NOT NULL DEFAULT true;
