import prisma from "../libs/prismaClient.js";
//helpers
import inviaErrore from "../helpers/inviaErrore.js";
import { trimmerStringa, trimmerNumero } from "../helpers/trimmer.js";
import { generaSlug } from "../helpers/generaSlug.js";

// Helper interno: recupera l'avventura tramite slugAvventura o risponde con errore.
// Restituisce l'oggetto avventura (con .id) se trovata, altrimenti null (dopo aver già inviato la risposta).
async function trovaAvventura(req, res) {
  const slugAvventura = trimmerStringa(req.params.slugAvventura);
  if (!slugAvventura) {
    inviaErrore(res, 400, "Lo slug dell'avventura non è valido");
    return null;
  }
  const avventura = await prisma.avventura.findUnique({
    where: { slugAvventura },
  });
  if (!avventura) {
    inviaErrore(res, 404, "Avventura non trovata");
    return null;
  }
  return avventura;
}

//INDEX
export async function episodiIndex(req, res) {
  const avventura = await trovaAvventura(req, res);
  if (!avventura) return;

  const { titoloEpisodio, numeroEpisodio } = req.query;

  const listaEpisodi = await prisma.episodio.findMany({
    where: {
      avventuraId: avventura.id,
      ...(trimmerStringa(titoloEpisodio) && {
        titoloEpisodio: { contains: trimmerStringa(titoloEpisodio) },
      }),
      ...(trimmerNumero(numeroEpisodio) && {
        numeroEpisodio: trimmerNumero(numeroEpisodio),
      }),
    },
    select: {
      id: true,
      titoloEpisodio: true,
      slugEpisodio: true,
      numeroEpisodio: true,
    },
    orderBy: {
      numeroEpisodio: "asc",
    },
  });

  res.json(listaEpisodi);
}

//SHOW
export async function episodiShow(req, res) {
  const avventura = await trovaAvventura(req, res);
  if (!avventura) return;

  const slugEpisodio = trimmerStringa(req.params.slugEpisodio);
  if (!slugEpisodio) {
    return inviaErrore(res, 400, "Lo slug dell'episodio non è valido");
  }

  // findUnique con chiave composta @@unique([avventuraId, slugEpisodio])
  const singoloEpisodio = await prisma.episodio.findUnique({
    where: {
      avventuraId_slugEpisodio: {
        avventuraId: avventura.id,
        slugEpisodio,
      },
    },
    include: {
      avventura: {
        select: {
          id: true,
          titoloAvventura: true,
          slugAvventura: true,
        },
      },
    },
  });

  if (!singoloEpisodio) {
    return inviaErrore(res, 404, "Episodio non trovato");
  }

  res.json(singoloEpisodio);
}

//STORE
export async function episodiStore(req, res) {
  const avventura = await trovaAvventura(req, res);
  if (!avventura) return;

  const {
    titoloEpisodio,
    numeroEpisodio,
    descrizioneCompletaEpisodio,
    riassuntoEpisodio,
    linkEpisodio,
  } = req.body;

  //validazione campi obbligatori
  if (
    !trimmerStringa(titoloEpisodio) ||
    !trimmerStringa(descrizioneCompletaEpisodio) ||
    !trimmerStringa(riassuntoEpisodio) ||
    !trimmerNumero(numeroEpisodio)
  ) {
    return inviaErrore(res, 400, "I campi obbligatori non possono essere vuoti");
  }

  const slugEpisodio = generaSlug(titoloEpisodio);
  if (!slugEpisodio) {
    return inviaErrore(res, 400, "Il titolo non produce uno slug valido");
  }

  // Verifica collisioni di titolo O slug all'interno della stessa avventura
  const duplicato = await prisma.episodio.findFirst({
    where: {
      avventuraId: avventura.id,
      OR: [
        { titoloEpisodio: trimmerStringa(titoloEpisodio) },
        { slugEpisodio },
      ],
    },
  });
  if (duplicato) {
    return inviaErrore(
      res,
      409,
      "Esiste già un episodio con questo titolo per questa avventura",
    );
  }

  const nuovoEpisodio = await prisma.episodio.create({
    data: {
      avventuraId: avventura.id,
      titoloEpisodio: trimmerStringa(titoloEpisodio),
      slugEpisodio,
      numeroEpisodio: trimmerNumero(numeroEpisodio),
      descrizioneCompletaEpisodio: trimmerStringa(descrizioneCompletaEpisodio),
      riassuntoEpisodio: trimmerStringa(riassuntoEpisodio),
      linkEpisodio: trimmerStringa(linkEpisodio) ?? null,
    },
  });

  res.status(201).json(nuovoEpisodio);
}

//UPDATE
export async function episodiUpdate(req, res) {
  const avventura = await trovaAvventura(req, res);
  if (!avventura) return;

  const slugEpisodio = trimmerStringa(req.params.slugEpisodio);
  if (!slugEpisodio) {
    return inviaErrore(res, 400, "Lo slug dell'episodio non è valido");
  }

  // Recupera l'episodio tramite chiave composta
  const episodioEsiste = await prisma.episodio.findUnique({
    where: {
      avventuraId_slugEpisodio: {
        avventuraId: avventura.id,
        slugEpisodio,
      },
    },
  });
  if (!episodioEsiste) {
    return inviaErrore(res, 404, "Episodio non trovato");
  }

  const {
    titoloEpisodio,
    numeroEpisodio,
    riassuntoEpisodio,
    descrizioneCompletaEpisodio,
    linkEpisodio,
  } = req.body;

  // Se arriva un nuovo titolo, ricalcola lo slug e controlla collisioni
  let nuovoSlug = undefined;
  if (trimmerStringa(titoloEpisodio)) {
    nuovoSlug = generaSlug(titoloEpisodio);
    if (!nuovoSlug) {
      return inviaErrore(res, 400, "Il titolo non produce uno slug valido");
    }

    const duplicato = await prisma.episodio.findFirst({
      where: {
        avventuraId: avventura.id,
        id: { not: episodioEsiste.id }, // non confrontare con se stesso
        OR: [
          { titoloEpisodio: trimmerStringa(titoloEpisodio) },
          { slugEpisodio: nuovoSlug },
        ],
      },
    });
    if (duplicato) {
      return inviaErrore(
        res,
        409,
        "Esiste già un episodio con questo titolo per questa avventura",
      );
    }
  }

  const episodioAggiornato = await prisma.episodio.update({
    where: {
      id: episodioEsiste.id,
    },
    data: {
      titoloEpisodio: trimmerStringa(titoloEpisodio),
      slugEpisodio: nuovoSlug,
      numeroEpisodio: trimmerNumero(numeroEpisodio),
      descrizioneCompletaEpisodio: trimmerStringa(descrizioneCompletaEpisodio),
      riassuntoEpisodio: trimmerStringa(riassuntoEpisodio),
      linkEpisodio:
        linkEpisodio === null || linkEpisodio === ""
          ? null // Se viene passato null o stringa vuota, cancella il link nel DB
          : trimmerStringa(linkEpisodio),
    },
  });

  res.json(episodioAggiornato);
}

//DESTROY
export async function episodiDestroy(req, res) {
  const avventura = await trovaAvventura(req, res);
  if (!avventura) return;

  const slugEpisodio = trimmerStringa(req.params.slugEpisodio);
  if (!slugEpisodio) {
    return inviaErrore(res, 400, "Lo slug dell'episodio non è valido");
  }

  // Recupera l'episodio tramite chiave composta
  const episodioEsiste = await prisma.episodio.findUnique({
    where: {
      avventuraId_slugEpisodio: {
        avventuraId: avventura.id,
        slugEpisodio,
      },
    },
  });
  if (!episodioEsiste) {
    return inviaErrore(res, 404, "Episodio non trovato");
  }

  await prisma.episodio.delete({
    where: {
      id: episodioEsiste.id,
    },
  });

  res.sendStatus(204);
}
