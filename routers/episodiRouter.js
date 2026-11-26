import express from "express";
import prisma from "../libs/prismaClient.js";
//helpers
import inviaErrore from "../helpers/inviaErrore.js";
import validazioneStringa from "../helpers/validazioneStringa.js";
import validazioneNumero from "../helpers/validazioneNumero.js";

const router = express.Router({ mergeParams: true }); //mergeParams: true permette di accedere ai parametri dell'URL padre

//INDEX (Read)
router.get("/", async (req, res) => {
  const avventuraId = Number(req.params.avventuraId);
  const { titoloEpisodio, numeroEpisodio } = req.query;

  if (!validazioneNumero(avventuraId)) {
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
      ...(titoloEpisodio && {
        titoloEpisodio: { contains: titoloEpisodio },
      }),
      ...(validazioneNumero(numeroEpisodio) && {
        numeroEpisodio: Number(numeroEpisodio),
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
});

//SHOW (Read)
router.get("/:id", async (req, res) => {
  const avventuraId = Number(req.params.avventuraId);
  const episodioId = Number(req.params.id);

  //validazione formato numerico intero
  if (!validazioneNumero(avventuraId) || !validazioneNumero(episodioId)) {
    return inviaErrore(res, 400, "L'ID non è valido");
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
});

//STORE (Create)
router.post("/", async (req, res) => {
  const avventuraId = Number(req.params.avventuraId);

  if (!validazioneNumero(avventuraId)) {
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
    !validazioneStringa(titoloEpisodio) ||
    !validazioneStringa(descrizioneCompletaEpisodio) ||
    !validazioneStringa(riassuntoEpisodio) ||
    !validazioneNumero(numeroEpisodio)
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
      titoloEpisodio,
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
      titoloEpisodio,
      numeroEpisodio: Number(numeroEpisodio),
      descrizioneCompletaEpisodio,
      riassuntoEpisodio,
      linkEpisodio: linkEpisodio || null,
    },
  });

  res.status(201).json(nuovoEpisodio);
});

//UPDATE (Update)
router.patch("/:id", (req, res) => {
  const avventuraId = Number(req.params.avventuraId);
  const episodioId = Number(req.params.id);

  res.send("Modifica dell'episodio " + episodioId);
});

//DESTROY (Destroy)
router.delete("/:id", async (req, res) => {
  const avventuraId = Number(req.params.avventuraId);
  const episodioId = Number(req.params.id);

  //validazione formato numerico intero di avventuraId ed episodioId
  if (!validazioneNumero(avventuraId) || !validazioneNumero(episodioId)) {
    return inviaErrore(res, 400, "L'ID non è valido");
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
});

export default router;
