-- DropForeignKey
ALTER TABLE `episodio` DROP FOREIGN KEY `Episodio_avventuraId_fkey`;

-- AddForeignKey
ALTER TABLE `Episodio` ADD CONSTRAINT `Episodio_avventuraId_fkey` FOREIGN KEY (`avventuraId`) REFERENCES `Avventura`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
