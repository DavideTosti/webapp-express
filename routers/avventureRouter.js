import express from "express";
import {
  avventureIndex,
  avventureShow,
} from "../controllers/avventureController.js";

const router = express.Router();

//INDEX (Read)
router.get("/", avventureIndex);

//SHOW (Read)
router.get("/:slugAvventura", avventureShow);

//STORE (Create)
router.post("/", (req, res) => {
  const avventuraBody = req.body;
  res.send("Creazione di una nuova avventura");
});

//UPDATE (Update)
router.patch("/:slugAvventura", (req, res) => {
  const avventuraSlug = req.params.slugAvventura;
  res.send("Modifica dell'avventura con slug " + avventuraSlug);
});

//DESTROY (Destroy)
router.delete("/:slugAvventura", (req, res) => {
  const avventuraSlug = req.params.slugAvventura;
  res.send("Eliminazione dell'avventura con slug " + avventuraSlug);
});

export default router;
