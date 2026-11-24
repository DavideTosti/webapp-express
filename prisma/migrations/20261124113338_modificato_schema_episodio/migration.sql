/*
  Warnings:

  - Added the required column `numeroEpisodio` to the `Episodio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `episodio` ADD COLUMN `numeroEpisodio` TINYINT NOT NULL;
