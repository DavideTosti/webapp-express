import express from "express";
import avventureRouter from "./routers/avventureRouter.js";
import episodiRouter from "./routers/episodiRouter.js";

const server = express();
const port = process.env.PORT || 3000;

//Middleware per il parsing del corpo delle richieste JSON
server.use(express.json());

server.get("/", (req, res) => {
  res.send("Homepage");
});

//Utilizza il router per gestire le richieste relative alle avventure
server.use("/avventure", avventureRouter);
server.use("/avventure/:avventuraId/episodi", episodiRouter);

server.listen(port, () => {
  console.log("Server in esecuzione su http://localhost:" + port);
});
