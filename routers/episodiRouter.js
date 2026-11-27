import express from "express";
//controllers
import {
  episodiDestroy,
  episodiIndex,
  episodiShow,
  episodiStore,
  episodiUpdate,
} from "../controllers/episodiController.js";

const router = express.Router({ mergeParams: true }); //mergeParams: true permette di accedere ai parametri dell'URL padre

//INDEX (Read) - lista degli episodi
router.get("/", episodiIndex);

//SHOW (Read) - dettaglio di uno specifico episodio
router.get("/:id", episodiShow);

//STORE (Create) - creazione di un nuovo episodio
router.post("/", episodiStore);

//UPDATE (Update) - modifica di uno specifico episodio
router.patch("/:id", episodiUpdate);

//DESTROY (Destroy) - eliminazione di uno specifico episodio
router.delete("/:id", episodiDestroy);

export default router;
