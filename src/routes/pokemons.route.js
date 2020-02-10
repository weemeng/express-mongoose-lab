const express = require("express");
const router = express.Router();
const Pokemon = require("../models/schema");
const wrapAsync = require("../utils/wrapAsync");

router.use(express.json());

const filterByName = async name => {
  const regex = new RegExp(name, "gi");
  const filteredPokemons = await Pokemon.find({ name: regex });
  return filteredPokemons;
};

router
  .route("/")
  .get(async (req, res) => {
    const AllPokemons = !!req.query.name
      ? await filterByName(req.query.name)
      : await Pokemon.find();
    res.status(200).send(AllPokemons);
  })
  .post(
    wrapAsync(async (req, res, next) => {
      // try {
      const pokemon = new Pokemon(req.body);
      await Pokemon.init();
      const newPokemonEntry = await pokemon.save();
      res.status(200).json(newPokemonEntry);
    })
  );

const filterById = async id => {
  const filteredPokemons = await Pokemon.find({ id: id });
  return filteredPokemons;
};

router
  .route("/:id")
  .get(async (req, res) => {
    const fPokemons = await filterById(req.params.id);
    res.send(fPokemons);
  })
  .put(async (req, res) => {
    const fPokemons = await Pokemon.findOneAndReplace(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).send(fPokemons);
  })
  .patch(async (req, res) => {
    const fPokemons = await Pokemon.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).send(fPokemons);
  })
  .delete(async (req, res) => {
    const fPokemons = await Pokemon.findOneAndDelete(req.params.id);    
    res.status(200).send(fPokemons);
  });
module.exports = router;
