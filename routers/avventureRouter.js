import express from "express";
import prisma from "../libs/prismaClient.js";

const router = express.Router();

const inviaErrore = (res, statusCode, errorMessage) => {
  res.status(statusCode).json({
    error: errorMessage,
  });
};

//INDEX (Read)
router.get("/", async (req, res) => {
  const { titoloAvventura, status, sistemaGioco } = req.query;

  const listaAvventure = await prisma.avventura.findMany({
    where: {
      ...(titoloAvventura && {
        titoloAvventura: { contains: titoloAvventura },
      }),
      ...(status && { status: status.toUpperCase() }),
      ...(sistemaGioco && { sistemaGioco: { contains: sistemaGioco } }),
    },
    select: {
      id: true,
      titoloAvventura: true,
      descrizioneAvventura: true,
      sistemaGioco: true,
      status: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  res.json(listaAvventure);
});

//SHOW (Read)
router.get("/:id", async (req, res) => {
  const avventuraId = Number(req.params.id);

  //validazione formato numerico intero
  if (!Number.isInteger(avventuraId)) {
    return inviaErrore(res, 400, "L'ID non è valido");
  }

  const singolaAvventura = await prisma.avventura.findUnique({
    where: {
      id: avventuraId,
    },
  });

  //validazione esistenza avventura
  if (!singolaAvventura) {
    return inviaErrore(res, 404, "Avventura non trovata");
  }

  res.json(singolaAvventura);
});

//STORE (Create)
router.post("/", (req, res) => {
  const avventuraBody = req.body;
  res.send("Creazione di una nuova avventura");
});

//UPDATE (Update)
router.patch("/:id", (req, res) => {
  const avventuraId = Number(req.params.id);
  res.send("Modifica dell'avventura con ID " + avventuraId);
});

//DESTROY (Destroy)
router.delete("/:id", (req, res) => {
  const avventuraId = Number(req.params.id);
  res.send("Eliminazione dell'avventura con ID " + avventuraId);
});

export default router;
