/*
  Warnings:

  - You are about to alter the column `sistemaGioco` on the `avventura` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `status` on the `avventura` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `avventura` MODIFY `titoloAvventura` VARCHAR(255) NOT NULL,
    MODIFY `descrizioneAvventura` LONGTEXT NOT NULL,
    MODIFY `sistemaGioco` VARCHAR(100) NOT NULL,
    MODIFY `status` ENUM('COMPLETATA', 'IN_CORSO', 'CANCELLATA') NOT NULL;

-- AlterTable
ALTER TABLE `episodio` MODIFY `titoloEpisodio` VARCHAR(255) NOT NULL,
    MODIFY `riassuntoEpisodio` TEXT NOT NULL,
    MODIFY `descrizioneCompletaEpisodio` LONGTEXT NOT NULL,
    MODIFY `linkEpisodio` VARCHAR(2048) NULL;
