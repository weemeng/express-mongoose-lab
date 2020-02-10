const PORT = 3000;
const app = require("./app");
require("./utils/db");
const Pokemon = require("./models/schema");
const { pokemonData } = require("./pokemonData");

const createAllPokemon = async pokemon => {
  try {
    await Pokemon.create(pokemon);
  } catch (err) {
    console.log(err.errmsg);
  }
};
createAllPokemon(pokemonData).then(console.log("Gotta Catch Em All"));


const server = app.listen(PORT, () => {
  console.log(`Server is now running at http://localhost:${PORT}`);
});
