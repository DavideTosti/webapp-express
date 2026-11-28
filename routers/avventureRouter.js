import express from "express";
import {
  avventureDestroy,
  avventureIndex,
  avventureShow,
  avventureStore,
  avventureUpdate,
} from "../controllers/avventureController.js";

const router = express.Router();

//INDEX (Read)
router.get("/", avventureIndex);

//SHOW (Read)
router.get("/:slugAvventura", avventureShow);

//STORE (Create)
router.post("/", avventureStore);

//UPDATE (Update)
router.patch("/:slugAvventura", avventureUpdate);

//DESTROY (Destroy)
router.delete("/:slugAvventura", avventureDestroy);

export default router;
