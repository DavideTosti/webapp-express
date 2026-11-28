import prisma from "../libs/prismaClient.js";
//helpers
import inviaErrore from "../helpers/inviaErrore.js";
import { trimmerStringa, trimmerNumero } from "../helpers/trimmer.js";
import { generaSlug } from "../helpers/generaSlug.js";

// Helper interno: recupera l'avventura tramite slugAvventura o risponde con errore.
// Restituisce l'oggetto avventura (con .id) se trovata, altrimenti null
async function trovaAvventura(req, res) {
  //controllo che lo slugavventura non sia nullo o undefined
  const avventuraSlug = trimmerStringa(req.params.slugAvventura);
  if (!avventuraSlug) {
    inviaErrore(res, 400, "Lo slug dell'avventura non è valido");
    return null;
  }
  //controllo che l'avventura esista cercandola tramite slug e restituisce l'avventura o null se non la trova
  const avventura = await prisma.avventura.findUnique({
    where: { slugAvventura: avventuraSlug },
  });
  if (!avventura) {
    inviaErrore(res, 404, "Avventura non trovata");
    return null;
  }
  return avventura;
}

//INDEX
export async function episodiIndex(req, res) {
  //recupero avventura tramite slugAvventura
  const avventura = await trovaAvventura(req, res);
  // blocca l'esecuzione se non trova l'avventura
  if (!avventura) return;

  // filtri opzionali per la query string
  const { titoloEpisodio, numeroEpisodio } = req.query;

  // query al db con eventuali filtri opzionali
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

    // quali campi includere nella risposta
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
  // recupero avventura tramite slugAvventura
  const avventura = await trovaAvventura(req, res);
  // blocca l'esecuzione se non trova l'avventura
  if (!avventura) return;

  // prendo lo slug dell'episodio dai parametri della richiesta
  const slugEpisodio = trimmerStringa(req.params.slugEpisodio);
  // controllo che lo slug dell'episodio sia valido
  if (!slugEpisodio) {
    return inviaErrore(res, 400, "Episodio non valido");
  }

  // query al db per trovare l'episodio
  const singoloEpisodio = await prisma.episodio.findUnique({
    // cerca tramite chiave composta @@unique([avventuraId, slugEpisodio])
    where: {
      avventuraId_slugEpisodio: {
        avventuraId: avventura.id,
        slugEpisodio,
      },
    },
    // quali campi includere nella risposta vengono restituiti di default da Prisma con findUnique, quindi select:{} è superflua

    // recupero dell'avventura correlata
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

  //validazione esistenza episodio
  if (!singoloEpisodio) {
    return inviaErrore(res, 404, "Episodio non trovato");
  }

  res.json(singoloEpisodio);
}

//STORE
export async function episodiStore(req, res) {
  // recupero avventura tramite slugAvventura
  const avventura = await trovaAvventura(req, res);
  // blocca l'esecuzione se non trova l'avventura
  if (!avventura) return;

  // prende i dati dell'episodio dai parametri della richiesta
  const {
    titoloEpisodio,
    numeroEpisodio,
    descrizioneCompletaEpisodio,
    riassuntoEpisodio,
    linkEpisodio,
  } = req.body;

  // controllo che i campi obbligatori non siano vuoti
  if (
    !trimmerStringa(titoloEpisodio) ||
    !trimmerStringa(descrizioneCompletaEpisodio) ||
    !trimmerStringa(riassuntoEpisodio) ||
    !trimmerNumero(numeroEpisodio)
  ) {
    return inviaErrore(res, 400, "Dei dati inseriti non sono corretti");
  }

  // Generazione slug
  const slugEpisodio = generaSlug(titoloEpisodio);
  if (!slugEpisodio) {
    return inviaErrore(res, 400, "Il titolo non produce uno slug valido");
  }

  // Verifica se esistono già titolo o slug all'interno della stessa avventura
  const duplicato = await prisma.episodio.findFirst({
    // cerca tra gli episodi della stessa avventura se ce n'è uno con lo stesso titolo o slug
    where: {
      avventuraId: avventura.id,
      // controlla se il titolo o lo slug sono uguali a quelli dell'episodio che si sta creando
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

  // creazione nuovo episodio nel db
  // lo slug viene generato automaticamente dal titolo
  const nuovoEpisodio = await prisma.episodio.create({
    data: {
      avventuraId: avventura.id,
      titoloEpisodio: trimmerStringa(titoloEpisodio),
      slugEpisodio,
      numeroEpisodio: trimmerNumero(numeroEpisodio),
      descrizioneCompletaEpisodio: trimmerStringa(descrizioneCompletaEpisodio),
      riassuntoEpisodio: trimmerStringa(riassuntoEpisodio),
      linkEpisodio: trimmerStringa(linkEpisodio) ?? null, //come un OR, ma più attento a casi di falsy values. Se fosse solo `||` in caso di 0 lo considererebbe falsy
    },
  });

  res.status(201).json(nuovoEpisodio);
}

//UPDATE
export async function episodiUpdate(req, res) {
  // recupero avventura tramite slugAvventura
  const avventura = await trovaAvventura(req, res);
  // blocca l'esecuzione se non trova l'avventura
  if (!avventura) return;

  // prendo lo slug dell'episodio dai parametri della richiesta
  const slugEpisodio = trimmerStringa(req.params.slugEpisodio);

  // controllo che lo slug dell'episodio sia valido
  if (!slugEpisodio) {
    return inviaErrore(res, 400, "Lo slug dell'episodio non è valido");
  }

  // query al db per recuperare l'episodio
  const episodioEsiste = await prisma.episodio.findUnique({
    // cerca tramite chiave composta @@unique([avventuraId, slugEpisodio])
    where: {
      avventuraId_slugEpisodio: {
        avventuraId: avventura.id,
        slugEpisodio,
      },
    },
  });

  // controlla che l'episodio esista
  if (!episodioEsiste) {
    return inviaErrore(res, 404, "Episodio non trovato");
  }

  // dati da aggiornare
  const {
    titoloEpisodio,
    numeroEpisodio,
    riassuntoEpisodio,
    descrizioneCompletaEpisodio,
    linkEpisodio,
  } = req.body;

  // Se arriva un nuovo titolo, ricalcola lo slug e controlla che sia valido e non esista già nel db
  let nuovoSlug = undefined;
  if (trimmerStringa(titoloEpisodio)) {
    nuovoSlug = generaSlug(titoloEpisodio);
    if (!nuovoSlug) {
      return inviaErrore(res, 400, "Il titolo non produce uno slug valido");
    }

    // controllo che non ci sia un episodio con lo stesso titolo o slug
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

  //aggiornamento episodio
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
  // recupero avventura tramite slugAvventura
  const avventura = await trovaAvventura(req, res);
  // blocca l'esecuzione se non trova l'avventura
  if (!avventura) return;

  // prendo lo slug dell'episodio dai parametri della richiesta
  const slugEpisodio = trimmerStringa(req.params.slugEpisodio);

  // controllo che lo slug dell'episodio sia valido
  if (!slugEpisodio) {
    return inviaErrore(res, 400, "Lo slug dell'episodio non è valido");
  }

  // query al db per recuperare l'episodio tramite chiave composta
  const episodioEsiste = await prisma.episodio.findUnique({
    where: {
      avventuraId_slugEpisodio: {
        avventuraId: avventura.id,
        slugEpisodio,
      },
    },
  });

  //controllo esistenza episodio
  if (!episodioEsiste) {
    return inviaErrore(res, 404, "Episodio non trovato");
  }

  //query al db per eliminare l'episodio
  await prisma.episodio.delete({
    where: {
      id: episodioEsiste.id,
    },
  });

  res.sendStatus(204);
}
