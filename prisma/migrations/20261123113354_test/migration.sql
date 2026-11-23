-- AlterTable
ALTER TABLE `avventura` MODIFY `descrizioneAvventura` LONGTEXT NULL,
    MODIFY `sistemaGioco` VARCHAR(100) NULL,
    MODIFY `status` ENUM('COMPLETATA', 'IN_CORSO', 'CANCELLATA') NULL;
