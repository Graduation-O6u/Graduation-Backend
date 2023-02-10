/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `jobs` ADD COLUMN `subName` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `imageUrl`,
    ADD COLUMN `backgroundImage` VARCHAR(191) NOT NULL DEFAULT 'https://www.solidbackgrounds.com/images/1920x1080/1920x1080-gray-solid-color-background.jpg',
    ADD COLUMN `image` VARCHAR(191) NOT NULL DEFAULT 'https://res.cloudinary.com/lms07/image/upload/v1645954589/avatar/6214b94ad832b0549b436264_avatar1645954588291.png';
