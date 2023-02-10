/*
  Warnings:

  - You are about to drop the column `token` on the `token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshId]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `token` DROP COLUMN `token`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `refreshId` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('RefreshToken', 'AccessToken') NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Token_refreshId_key` ON `Token`(`refreshId`);

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_refreshId_fkey` FOREIGN KEY (`refreshId`) REFERENCES `Token`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
