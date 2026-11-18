import express from "express";

const router = express.Router();

//INDEX (Read)
router.get("/", (req, res) => {
  res.send("Lista completa delle avventure");
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
