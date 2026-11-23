import { faker } from "@faker-js/faker";
import prisma from "../libs/prismaClient.js";

async function main() {
  console.log("Seeder avviato");

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

  //creazione avventure
  const titoloAvventure = faker.helpers
    .uniqueArray(() => faker.lorem.words({ min: 1, max: 5 }), 15)
    .map((titoloAvventura) => ({
      titoloAvventura,
      descrizioneAvventura: faker.lorem.paragraph(),
      sistemaGioco: faker.helpers.arrayElement(sistemi),
      status: faker.helpers.arrayElement(stati),
    }));

  await prisma.avventura.deleteMany();

  await prisma.avventura.createMany({
    data: titoloAvventure,
  });

  const avventure = await prisma.avventura.findMany();
  console.log(avventure);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
