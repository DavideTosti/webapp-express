/*
  Warnings:

  - Made the column `descrizioneAvventura` on table `avventura` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sistemaGioco` on table `avventura` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `avventura` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `avventura` MODIFY `descrizioneAvventura` LONGTEXT NOT NULL,
    MODIFY `sistemaGioco` VARCHAR(100) NOT NULL,
    MODIFY `status` ENUM('COMPLETATA', 'IN_CORSO', 'CANCELLATA') NOT NULL;
