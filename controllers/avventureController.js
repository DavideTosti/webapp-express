import prisma from "../libs/prismaClient.js";
//helpers
import inviaErrore from "../helpers/inviaErrore.js";
import { trimmerStringa, trimmerNumero } from "../helpers/trimmer.js";
import { generaSlug } from "../helpers/generaSlug.js";

//INDEX
export async function avventureIndex(req, res) {
  // filtri opzionali per la query string
  const { titoloAvventura, status, sistemaGioco } = req.query;

  // query al db con eventuali filtri opzionali
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

    // quali campi includere nella risposta
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
  // prendo lo slug dell'avventura dai parametri della richiesta
  const avventuraSlug = trimmerStringa(req.params.slugAvventura);

  //validazione slug dell'avventura
  if (!avventuraSlug) {
    return inviaErrore(res, 400, "L'avventura non è valida");
  }

  // query al db per trovare l'avventura
  const singolaAvventura = await prisma.avventura.findUnique({
    // con lo slug recupera la specifica avventura
    where: {
      slugAvventura: avventuraSlug,
    },
    // quali campi includere nella risposta vengono restituiti di default da Prisma con findUnique, quindi select:{} è superflua

    // recupero degli episodi correlati
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
export async function avventureStore(req, res) {
  // prende i dati dell'avventura dai parametri della richiesta
  const { titoloAvventura, descrizioneAvventura, sistemaGioco, status } =
    req.body;

  // controllo che i campi obbligatori non siano vuoti
  if (
    !trimmerStringa(titoloAvventura) ||
    !trimmerStringa(descrizioneAvventura) ||
    !trimmerStringa(sistemaGioco) ||
    !trimmerStringa(status)
  ) {
    return inviaErrore(res, 400, "Dei dati inseriti non sono corretti");
  }

  // Generazione slug
  const slugAvventura = generaSlug(titoloAvventura);
  if (!slugAvventura) {
    return inviaErrore(res, 400, "Il titolo non produce uno slug valido");
  }

  // Controllo se esistono già titolo o slug nel db
  const duplicato = await prisma.avventura.findFirst({
    where: {
      OR: [
        { titoloAvventura: trimmerStringa(titoloAvventura) },
        { slugAvventura },
      ],
    },
  });
  if (duplicato) {
    return inviaErrore(res, 409, "Esiste già un'avventura con questo titolo");
  }

  // creazione nuova avventura nel db
  // lo slug viene generato automaticamente dal titolo
  const nuovaAvventura = await prisma.avventura.create({
    data: {
      titoloAvventura: trimmerStringa(titoloAvventura),
      slugAvventura,
      descrizioneAvventura: trimmerStringa(descrizioneAvventura),
      sistemaGioco: trimmerStringa(sistemaGioco),
      status: trimmerStringa(status).toUpperCase(),
    },
  });
  res.status(201).json(nuovaAvventura);
}

//UPDATE
export async function avventureUpdate(req, res) {
  // prendo lo slug dell'avventura dai parametri della richiesta
  const avventuraSlug = trimmerStringa(req.params.slugAvventura);

  //validazione slug dell'avventura
  if (!avventuraSlug) {
    return inviaErrore(res, 400, "L'avventura non è valida");
  }

  // query al db per trovare l'avventura tramite lo slug
  const avventuraEsiste = await prisma.avventura.findUnique({
    where: {
      slugAvventura: avventuraSlug,
    },
  });

  //controlla che l'avventura cercata esista
  if (!avventuraEsiste) {
    return inviaErrore(res, 404, "Avventura non trovata");
  }

  //dati da aggiornare
  const { titoloAvventura, descrizioneAvventura, sistemaGioco, status } =
    req.body;

  // Se arriva un nuovo titolo, ricalcola lo slug e controlla che sia valido e non esista già nel db
  let nuovoSlug = undefined;
  if (trimmerStringa(titoloAvventura)) {
    nuovoSlug = generaSlug(titoloAvventura);
    if (!nuovoSlug) {
      return inviaErrore(res, 400, "Il titolo non produce uno slug valido");
    }
    // controlla se esiste già nel db (escluso l'item che si sta modificando)
    const duplicato = await prisma.avventura.findFirst({
      where: {
        id: { not: avventuraEsiste.id }, // non confrontare con se stesso
        OR: [
          { titoloAvventura: trimmerStringa(titoloAvventura) },
          { slugAvventura: nuovoSlug },
        ],
      },
    });

    if (duplicato) {
      return inviaErrore(res, 409, "Esiste già un'avventura con questo titolo");
    }
  }

  //aggiornamento avventura
  const avventuraAggiornata = await prisma.avventura.update({
    where: {
      id: avventuraEsiste.id,
    },
    data: {
      titoloAvventura: trimmerStringa(titoloAvventura),
      slugAvventura: nuovoSlug,
      descrizioneAvventura: trimmerStringa(descrizioneAvventura),
      sistemaGioco: trimmerStringa(sistemaGioco),
      status: trimmerStringa(status)?.toUpperCase(),
    },
  });

  res.json(avventuraAggiornata);
}

//DESTROY
export async function avventureDestroy(req, res) {
  // prendo lo slug dell'avventura dai parametri della richiesta
  const avventuraSlug = trimmerStringa(req.params.slugAvventura);

  //validazione slug dell'avventura
  if (!avventuraSlug) {
    return inviaErrore(res, 400, "L'avventura non è valida");
  }

  // query al db per trovare l'avventura tramite lo slug
  const avventuraEsiste = await prisma.avventura.findUnique({
    where: {
      slugAvventura: avventuraSlug,
    },
  });

  //controllo esistenza avventura
  if (!avventuraEsiste) {
    return inviaErrore(res, 404, "Avventura non trovata");
  }

  // eliminazione avventura
  await prisma.avventura.delete({
    where: {
      id: avventuraEsiste.id,
    },
  });

  res.sendStatus(204);
}
