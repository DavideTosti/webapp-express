import express from "express";
import prisma from "../libs/prismaClient.js";

const router = express.Router();

//INDEX (Read)
router.get("/", async (req, res) => {
  const { status, sistemaGioco } = req.query;

  const avventure = await prisma.avventura.findMany({
    where: {
      ...(status && { status }),
      ...(sistemaGioco && { sistemaGioco }),
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
  res.json(avventure);
});

//SHOW (Read)
router.get("/:id", (req, res) => {
  const avventuraId = Number(req.params.id);
  res.send("Dettaglio dell'avventura con ID " + avventuraId);
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
