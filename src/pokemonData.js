const pokemonData = [
  {
    id: 1,
    name: "Pikachu",
    japaneseName: "ピカチュウ",
    baseHP: 35,
    category: "Mouse Pokemon"
  },
  {
    id: 2,
    name: "Squirtle",
    japaneseName: "ゼニガメ",
    baseHP: 44,
    category: "Tiny Turtle Pokemon"
  },
  {
    id: 3,
    name: "Wartortle",
    japaneseName: "カメール",
    baseHP: 59,
    category: "Turtle Pokémon"
  },
  {
    id: 4,
    name: "Meowth",
    japaneseName: "ニャース",
    baseHP: 40,
    category: "Scratch Cat Pokémon"
  }
];

const basicResponse = {
  "0": "GET    /",
  "1": "GET   /pokemons",
  "2": "GET   /pokemons?name=pokemonNameNotExact",
  "3": "POST    /pokemons",
  "4": "GET /pokemons/:id",
  "5": "PUT /pokemons/:id",
  "6": "PATCH /pokemons/:id",
  "7": "DELETE /pokemons/:id"
};

module.exports = { pokemonData, basicResponse };
