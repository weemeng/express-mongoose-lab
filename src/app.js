const express = require("express");
const app = express();
const { basicResponse } = require("./pokemonData");
const pokemonsRouter = require("./routes/pokemons.route");

app.use("/pokemons", pokemonsRouter);

app.get("/", (req, res) => {
  res.status(200).send(basicResponse);
});

app.use("/*", (req, res, next)=> {
  next(new Error("no such route"))
})

app.use((err, req, res, next) => { //error handler needs all 4 to work
  console.log("GOT TO CATCH THEM ALL POKEMON");
  res.status = err.statusCode || 500;
  if (err.code) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server errro" });
  }
});

module.exports = app;
