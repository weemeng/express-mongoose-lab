require("dotenv").config();
require("./utils/db");

const app = require("./app");
const Pokemon = require("./models/pokemon.model");
const { pokemonData } = require("./pokemonData");

const createAllPokemon = async pokemon => {
  try {
    await Pokemon.create(pokemon);
  } catch (err) {
    // console.log(err.errmsg);
  }
};
createAllPokemon(pokemonData).then(console.log("Gotta Catch Em All"));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
const server = app.listen(port, () => {
  console.log(`Server is now running at http://localhost:${PORT}`);
});
