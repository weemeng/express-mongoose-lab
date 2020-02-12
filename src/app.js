const express = require("express");
const app = express();
const pokemonsRouter = require("./routes/pokemons.route");
const trainersRouter = require('./routes/trainers.route');
const { basicResponse } = require("./pokemonData");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  credentials: true,
  allowedHeaders: "content-type",
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());


app.use("/pokemons", pokemonsRouter);
app.use("/trainers", trainersRouter);

app.get("/", (req, res) => {
  res.status(200).send(basicResponse);
});

app.use("/*", (req, res, next) => {
  next(new Error("no such route"));
});

app.use((err, req, res, next) => {
  //error handler needs all 4 to work
  console.log("CAUGHT EM' ALL");
  console.log(err.message)
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  } else if (err.name === "MongoError" && err.code === 11000) {
    err.statusCode = 422;
  }
  res.status(err.statusCode || 500);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});

module.exports = app;
