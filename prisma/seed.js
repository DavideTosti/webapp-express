import { faker } from "@faker-js/faker";
import prisma from "../libs/prismaClient.js";

async function main() {
  console.log("Seeder avviato");

  //1. UTILITIES
  // Sistemi di gioco possibili
  const sistemi = [
    "D&D 5e",
    "Pathfinder 2e",
    "Call of Cthulhu",
    "Cyberpunk RED",
    "Sine Requie",
  ];
  // Valori dell'enum StatusAvventura definiti nello schema
  const stati = ["COMPLETATA", "IN_CORSO", "CANCELLATA"];

  //2. PULIZIA DATABASE
  await prisma.episodio.deleteMany();
  await prisma.avventura.deleteMany();

  //3. CREAZIONE AVVENTURE
  //creazione di titoli univoci di avventure
  const titoliAvventureUnivoci = faker.helpers.uniqueArray(
    () => faker.lorem.words({ min: 1, max: 5 }),
    15,
  );

  //Associo ad ogni titolo un descrizione, un sistema di gioco e uno stato
  const datiAvventure = titoliAvventureUnivoci.map((titoloAvventura) => ({
    titoloAvventura,
    descrizioneAvventura: faker.lorem.paragraph(),
    sistemaGioco: faker.helpers.arrayElement(sistemi),
    status: faker.helpers.arrayElement(stati),
  }));

  //inserisci avventure
  await prisma.avventura.createMany({
    data: datiAvventure,
  });

  //prendi le avventure create
  const avventure = await prisma.avventura.findMany();

  //4. CREAZIONE EPISODI
  //creazione di titoli univoci di episodi
  const titoliEpisodiUnivoci = faker.helpers.uniqueArray(
    () => faker.lorem.words({ min: 1, max: 5 }),
    55,
  );

  //Associo ad ogni titolo un avventura, un numero episodio, un riassunto, una descrizione e un link
  const datiEpisodi = titoliEpisodiUnivoci.map((titoloEpisodio) => ({
    titoloEpisodio,
    avventuraId: faker.helpers.arrayElement(avventure).id,
    numeroEpisodio: faker.number.int({ min: 1, max: 55 }),
    riassuntoEpisodio: faker.lorem.paragraph(),
    descrizioneCompletaEpisodio: faker.lorem.paragraph(),
    linkEpisodio: faker.internet.url(),
  }));

  //inserisci episodi
  await prisma.episodio.createMany({
    data: datiEpisodi,
  });

  //prendi le avventure create per associarle agli episodi
  const avventureConEpisodi = await prisma.avventura.findMany({
    include: { episodi: true },
  });

  //5. LOG DELLE AVVENTURE COMPLETE, CON EPISODI ASSOCIATI
  console.log(
    `Seed completato. ${avventure.length} avventure e ${datiEpisodi.length} episodi inseriti.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
