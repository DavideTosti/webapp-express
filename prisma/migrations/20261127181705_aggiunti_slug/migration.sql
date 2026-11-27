/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Avventura` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avventuraId,slug]` on the table `Episodio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Avventura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Episodio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `avventura` ADD COLUMN `slug` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `episodio` ADD COLUMN `slug` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Avventura_slug_key` ON `Avventura`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Episodio_avventuraId_slug_key` ON `Episodio`(`avventuraId`, `slug`);
