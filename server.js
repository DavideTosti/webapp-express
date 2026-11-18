import express from "express";

const server = express();
const port = process.env.PORT || 3000;

server.get("/", (req, res) => {
  res.send("Homepage");
});

server.listen(port, () => {
  console.log("Server in esecuzione su http://localhost:" + port);
});
