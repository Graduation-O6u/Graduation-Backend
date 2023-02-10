/*
  Warnings:

  - You are about to drop the column `name` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `subName` on the `jobs` table. All the data in the column will be lost.
  - Added the required column `title` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jobs` DROP COLUMN `name`,
    DROP COLUMN `subName`,
    ADD COLUMN `subTitle` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
