import express from "express";
import prisma from "../libs/prismaClient.js";
import {
  avventureIndex,
  avventureShow,
} from "../controllers/avventureController.js";

const router = express.Router();

const inviaErrore = (res, statusCode, errorMessage) => {
  res.status(statusCode).json({
    error: errorMessage,
  });
};

//INDEX (Read)
router.get("/", avventureIndex);

//SHOW (Read)
router.get("/:id", avventureShow);

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
