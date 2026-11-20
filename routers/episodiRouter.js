import express from "express";

const router = express.Router({ mergeParams: true }); //mergeParams: true permette di accedere ai parametri dell'URL padre

//INDEX (Read)
router.get("/", (req, res) => {
  const avventuraId = Number(req.params.avventuraId);
  res.send("Lista degli episodi dell'avventura " + avventuraId);
});

//SHOW (Read)
router.get("/:id", (req, res) => {
  const avventuraId = Number(req.params.avventuraId);
  const episodioId = Number(req.params.id);

  res.send("Episodio " + episodioId + " dell'avventura " + avventuraId);
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
