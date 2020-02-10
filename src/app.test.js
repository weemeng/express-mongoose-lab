const request = require("supertest");
const app = require("./app");
const Pokemon = require("./models/schema");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { pokemonData, basicResponse } = require("./pokemonData");
// const app = require("./pokemons.route")

describe("/pokemons", () => {
  let mongoServer;
  // Set up
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });
  // Tear down
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  // Seeding
  beforeEach(async () => {
    await Pokemon.create(pokemonData);
  });

  afterEach(async () => {
    await Pokemon.deleteMany();
  });
  describe("/pokemons", () => {
    it("should return 1 given 1", () => {
      expect(1).toBe(1);
    });

    it("should return basic Response object", async () => {
      const agent = request(app);
      const { body: basicReplyFrame } = await agent.get("/").expect(200);
      expect(basicReplyFrame).toMatchObject(basicResponse);
    });

    it("GET /pokemons should respond with all pokemons", async () => {
      const agent = request(app);
      const response = await agent.get("/pokemons").expect(200);
      expect(response.body).toMatchObject(pokemonData);
    });

    it("GET /pokemons/:id should respond with the pokemon with corresponding id", async () => {
      const agent = request(app);
      const response = await agent.get("/pokemons/2").expect(200);
      expect(response.body).toMatchObject([pokemonData[1]]);
    });

    it("PUT /pokemons/:id HTTP Response status code: 200", async () => {
      const agent = request(app);
      const replacementPokemon = {
        id: 250,
        name: "Ho-oh",
        japaneseName: "ホウオウ",
        baseHP: 106,
        category: "Rainbow Pokemon"
      };
      const response = await agent
        .put("/pokemons/2")
        .send(replacementPokemon)
        .expect(200);
      expect(response.body).toMatchObject(replacementPokemon);
    });
    it("PATCH /pokemons/:id HTTP Response status code: 200", async () => {
      const replacementStats = {baseHP : 1}
      const expectedPokemon = pokemonData[0];
      expectedPokemon.baseHP = 1
      const agent = request(app);
      const response = await agent.patch("/pokemons/1").send(replacementStats).expect(200);
      expect(response.body).toMatchObject(expectedPokemon)
    })
    it("DELETE /pokemons/:id HTTP Response: 200", async() => {
      const agent = request(app);
      const response = await agent.delete("/pokemons/1").expect(200);
      expect(response.body).toMatchObject(pokemonData[0])
    })
  });
});
