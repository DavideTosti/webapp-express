import express from "express";
import prisma from "../libs/prismaClient.js";

const router = express.Router({ mergeParams: true }); //mergeParams: true permette di accedere ai parametri dell'URL padre

const inviaErrore = (res, statusCode, errorMessage) => {
  res.status(statusCode).json({
    error: errorMessage,
  });
};

//INDEX (Read)
router.get("/", async (req, res) => {
  const avventuraId = Number(req.params.avventuraId);
  const { titoloEpisodio, numeroEpisodio } = req.query;

  if (!Number.isInteger(avventuraId)) {
    return inviaErrore(res, 400, "L'ID dell'avventura non è valido");
  }

  const listaEpisodi = await prisma.episodio.findMany({
    where: {
      avventuraId,
      ...(titoloEpisodio && {
        titoloEpisodio: { contains: titoloEpisodio },
      }),
      ...(numeroEpisodio &&
        !isNaN(Number(numeroEpisodio)) && {
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
  if (!Number.isInteger(avventuraId) || !Number.isInteger(episodioId)) {
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
router.post("/", (req, res) => {
  const avventuraId = Number(req.params.avventuraId);
  const episodioBody = req.body;

  res.send("Creazione di un episodio per l'avventura " + avventuraId);
});

//UPDATE (Update)
router.patch("/:id", (req, res) => {
  const avventuraId = Number(req.params.avventuraId);
  const episodioId = Number(req.params.id);

  res.send("Modifica dell'episodio " + episodioId);
});

//DESTROY (Destroy)
router.delete("/:id", (req, res) => {
  const avventuraId = Number(req.params.avventuraId);
  const episodioId = Number(req.params.id);

  res.send("Eliminazione dell'episodio " + episodioId);
});

export default router;
