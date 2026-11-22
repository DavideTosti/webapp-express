-- CreateTable
CREATE TABLE `Avventura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titoloAvventura` VARCHAR(191) NOT NULL,
    `descrizioneAvventura` VARCHAR(191) NOT NULL,
    `sistemaGioco` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Avventura_titoloAvventura_key`(`titoloAvventura`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Episodio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avventuraId` INTEGER NOT NULL,
    `titoloEpisodio` VARCHAR(191) NOT NULL,
    `riassuntoEpisodio` VARCHAR(191) NOT NULL,
    `descrizioneCompletaEpisodio` VARCHAR(191) NOT NULL,
    `linkEpisodio` VARCHAR(191) NULL,

    UNIQUE INDEX `Episodio_avventuraId_titoloEpisodio_key`(`avventuraId`, `titoloEpisodio`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Episodio` ADD CONSTRAINT `Episodio_avventuraId_fkey` FOREIGN KEY (`avventuraId`) REFERENCES `Avventura`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
