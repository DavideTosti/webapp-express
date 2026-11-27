/*
  Warnings:

  - You are about to drop the column `slug` on the `avventura` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `episodio` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slugAvventura]` on the table `Avventura` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avventuraId,slugEpisodio]` on the table `Episodio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slugAvventura` to the `Avventura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugEpisodio` to the `Episodio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `episodio` DROP FOREIGN KEY `Episodio_avventuraId_fkey`;

-- DropIndex
DROP INDEX `Avventura_slug_key` ON `avventura`;

-- DropIndex
DROP INDEX `Episodio_avventuraId_slug_key` ON `episodio`;

-- AlterTable
ALTER TABLE `avventura` DROP COLUMN `slug`,
    ADD COLUMN `slugAvventura` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `episodio` DROP COLUMN `slug`,
    ADD COLUMN `slugEpisodio` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Avventura_slugAvventura_key` ON `Avventura`(`slugAvventura`);

-- CreateIndex
CREATE UNIQUE INDEX `Episodio_avventuraId_slugEpisodio_key` ON `Episodio`(`avventuraId`, `slugEpisodio`);

-- AddForeignKey
ALTER TABLE `Episodio` ADD CONSTRAINT `Episodio_avventuraId_fkey` FOREIGN KEY (`avventuraId`) REFERENCES `Avventura`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
