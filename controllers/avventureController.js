import prisma from "../libs/prismaClient.js";
//helpers
import inviaErrore from "../helpers/inviaErrore.js";
import { trimmerStringa, trimmerNumero } from "../helpers/trimmer.js";

//INDEX
export async function avventureIndex(req, res) {
  const { titoloAvventura, status, sistemaGioco } = req.query;

  const listaAvventure = await prisma.avventura.findMany({
    where: {
      ...(trimmerStringa(titoloAvventura) && {
        titoloAvventura: { contains: trimmerStringa(titoloAvventura) },
      }),
      ...(trimmerStringa(status) && {
        status: trimmerStringa(status).toUpperCase(),
      }),
      ...(trimmerStringa(sistemaGioco) && {
        sistemaGioco: { contains: trimmerStringa(sistemaGioco) },
      }),
    },
    select: {
      id: true,
      titoloAvventura: true,
      slugAvventura: true,
      descrizioneAvventura: true,
      sistemaGioco: true,
      status: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  res.json(listaAvventure);
}

//SHOW
export async function avventureShow(req, res) {
  const avventuraSlug = trimmerStringa(req.params.slugAvventura);

  //validazione slug dell'avventura
  if (!avventuraSlug) {
    return inviaErrore(res, 400, "L'avventura non è valida");
  }

  const singolaAvventura = await prisma.avventura.findUnique({
    where: {
      slugAvventura: avventuraSlug,
    },
    include: {
      episodi: {
        select: {
          id: true,
          numeroEpisodio: true,
          titoloEpisodio: true,
          slugEpisodio: true,
        },
        orderBy: {
          numeroEpisodio: "asc",
        },
      },
    },
  });

  //validazione esistenza avventura
  if (!singolaAvventura) {
    return inviaErrore(res, 404, "Avventura non trovata");
  }

  res.json(singolaAvventura);
}

//STORE
export async function avventureStore(req, res) {}

//UPDATE
export async function avventureUpdate(req, res) {}

//DESTROY
export async function avventureDestroy(req, res) {}
