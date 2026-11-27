import prisma from "../libs/prismaClient.js";
//helpers
import inviaErrore from "../helpers/inviaErrore.js";
import { trimmerStringa, trimmerNumero } from "../helpers/trimmer.js";

//INDEX
export async function episodiIndex(req, res) {
  const avventuraId = trimmerNumero(req.params.avventuraId);
  const { titoloEpisodio, numeroEpisodio } = req.query;

  if (!avventuraId) {
    return inviaErrore(res, 400, "L'ID dell'avventura non è valido");
  }

  //controllo se l'avventura esiste nel database (AGGIUNTA)
  const avventuraEsiste = await prisma.avventura.findUnique({
    where: { id: avventuraId },
  });
  if (!avventuraEsiste) {
    return inviaErrore(res, 404, "Avventura non trovata");
  }

  const listaEpisodi = await prisma.episodio.findMany({
    where: {
      avventuraId,
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
  const avventuraId = trimmerNumero(req.params.avventuraId);
  const episodioId = trimmerNumero(req.params.id);

  if (!avventuraId) {
    return inviaErrore(res, 400, "L'ID dell'avventura non è valido");
  }
  if (!episodioId) {
    return inviaErrore(res, 400, "L'ID dell'episodio non è valido");
  }

  const singoloEpisodio = await prisma.episodio.findFirst({
    where: {
      id: episodioId,
      avventuraId,
    },
    include: {
      avventura: {
        select: {
          id: true,
          titoloAvventura: true,
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
  const avventuraId = trimmerNumero(req.params.avventuraId);

  if (!avventuraId) {
    return inviaErrore(res, 400, "L'ID dell'avventura non è valido");
  }

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
    return inviaErrore(
      res,
      400,
      "I campi obbligatori non possono essere vuoti",
    );
  }

  //validazione id avventura
  const avventura = await prisma.avventura.findUnique({
    where: {
      id: avventuraId,
    },
  });

  if (!avventura) {
    return inviaErrore(res, 404, "Avventura non trovata");
  }

  // Verifica se esiste già un episodio con lo stesso titolo in questa avventura
  const titoloGiaPresente = await prisma.episodio.findFirst({
    where: {
      avventuraId,
      titoloEpisodio: trimmerStringa(titoloEpisodio),
    },
  });
  if (titoloGiaPresente) {
    return inviaErrore(
      res,
      409,
      "Esiste già un episodio con questo titolo per questa avventura",
    );
  }

  const nuovoEpisodio = await prisma.episodio.create({
    data: {
      avventuraId,
      titoloEpisodio: trimmerStringa(titoloEpisodio),
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
  const avventuraId = trimmerNumero(req.params.avventuraId);
  const episodioId = trimmerNumero(req.params.id);

  if (!avventuraId) {
    return inviaErrore(res, 400, "L'ID dell'avventura non è valido");
  }
  if (!episodioId) {
    return inviaErrore(res, 400, "L'ID dell'episodio non è valido");
  }

  //validazione esistenza avventura
  const avventuraEsiste = await prisma.avventura.findUnique({
    where: {
      id: avventuraId,
    },
  });

  if (!avventuraEsiste) {
    return inviaErrore(res, 404, "Avventura non trovata");
  }

  //validazione esistenza episodio all'interno della specifica avventura
  const episodioEsiste = await prisma.episodio.findFirst({
    where: {
      id: episodioId,
      avventuraId,
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

  // Verifica se esiste già un episodio con lo stesso titolo in questa avventura SOLO se è stato fornito un nuovo titolo
  if (trimmerStringa(titoloEpisodio)) {
    const titoloGiaPresente = await prisma.episodio.findFirst({
      where: {
        avventuraId,
        titoloEpisodio: trimmerStringa(titoloEpisodio),
        id: { not: episodioId }, // Non confrontarlo con se stesso
      },
    });
    if (titoloGiaPresente) {
      return inviaErrore(
        res,
        409,
        "Esiste già un episodio con questo titolo per questa avventura",
      );
    }
  }

  const episodioAggiornato = await prisma.episodio.update({
    where: {
      id: episodioId,
    },
    data: {
      titoloEpisodio: trimmerStringa(titoloEpisodio),
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
  const avventuraId = trimmerNumero(req.params.avventuraId);
  const episodioId = trimmerNumero(req.params.id);

  if (!avventuraId) {
    return inviaErrore(res, 400, "L'ID dell'avventura non è valido");
  }
  if (!episodioId) {
    return inviaErrore(res, 400, "L'ID dell'episodio non è valido");
  }

  //validazione esistenza episodio
  const episodioEsiste = await prisma.episodio.findFirst({
    where: {
      id: episodioId,
      avventuraId,
    },
  });

  if (!episodioEsiste) {
    return inviaErrore(res, 404, "Episodio non trovato");
  }

  await prisma.episodio.delete({
    where: {
      id: episodioId,
    },
  });

  res.sendStatus(204);
}
