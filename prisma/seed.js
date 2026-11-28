import { faker } from "@faker-js/faker";
import prisma from "../libs/prismaClient.js";
import { generaSlug } from "../helpers/generaSlug.js";

async function main() {
  console.log("Seeder avviato");

  const sistemi = [
    "D&D 5e",
    "Pathfinder 2e",
    "Call of Cthulhu",
    "Cyberpunk RED",
    "Sine Requie",
  ];

  const stati = ["COMPLETATA", "IN_CORSO", "CANCELLATA"];

  await prisma.episodio.deleteMany();
  await prisma.avventura.deleteMany();

  const titoliAvventureUnivoci = faker.helpers.uniqueArray(
    () => faker.lorem.words({ min: 1, max: 5 }),
    15,
  );

  const datiAvventure = titoliAvventureUnivoci.map((titoloAvventura) => ({
    titoloAvventura,
    slugAvventura: generaSlug(titoloAvventura),
    descrizioneAvventura: faker.lorem.paragraph(),
    sistemaGioco: faker.helpers.arrayElement(sistemi),
    status: faker.helpers.arrayElement(stati),
  }));

  await prisma.avventura.createMany({
    //avventura = Avventura stabilita nel modello nel file schema.prisma
    data: datiAvventure,
  });

  const avventure = await prisma.avventura.findMany();

  const datiEpisodi = [];
  for (const singolaAvventura of avventure) {
    const numeroDiEpisodi = faker.number.int({ min: 3, max: 10 });
    const slugUsati = new Set(); // guardia anti-collisione slug nella stessa avventura
    for (let num = 1; num <= numeroDiEpisodi; num++) {
      const titoloEpisodio = faker.lorem.words({ min: 1, max: 5 });
      let slugEpisodio = generaSlug(titoloEpisodio);
      // Se lo slug è già usato in questa avventura, aggiunge il numero episodio come suffisso
      if (slugUsati.has(slugEpisodio)) {
        slugEpisodio = `${slugEpisodio}-${num}`;
      }
      slugUsati.add(slugEpisodio);
      datiEpisodi.push({
        titoloEpisodio,
        slugEpisodio,
        avventuraId: singolaAvventura.id,
        numeroEpisodio: num,
        riassuntoEpisodio: faker.lorem.paragraph(),
        descrizioneCompletaEpisodio: faker.lorem.paragraph(),
        linkEpisodio: faker.internet.url(),
      });
    }
  }

  await prisma.episodio.createMany({
    data: datiEpisodi,
  });

  //OPZIONALE: Lettura di verifica / visualizzazione dell'intero DB con relazioni
  const avventureConEpisodi = await prisma.avventura.findMany({
    include: { episodi: true },
  });
  console.dir(avventureConEpisodi, { depth: null });

  //
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
