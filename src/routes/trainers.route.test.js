const request = require("supertest");
const app = require("../app");

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Trainer = require("../models/trainer.model");

// test trainer
// test login logout
const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("trainers", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  beforeEach(async () => {
    const TrainerData = [
      {
        username: "ash1",
        password: "IwantobetheverybesT"
      },
      {
        username: "ash2",
        password: "IwantobetheverybesT"
      }
    ];
    await Trainer.create(TrainerData);
    jest.spyOn(console, "error");
    console.error.mockReturnValue({});
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Trainer.deleteMany();
  });

  describe("/trainers", () => {
    it("POST should add a new trainer", async () => {
      const expectedTrainer = {
        username: "ashthenoob0",
        password: "123456789"
      };
      const { body: trainer } = await request(app)
        .post("/trainers/register")
        .send(expectedTrainer)
        .expect(201);
      expect(trainer.username).toBe(expectedTrainer.username);
      expect(trainer.password).not.toBe(expectedTrainer.password);
    });
    it("POST should not post a new trainer when password is less than 8", async () => {
      const wrongTrainer = {
        username: "ashthenoob0",
        password: "1234567"
      };
      const { body: error } = await request(app)
        .post("/trainers/register")
        .send(wrongTrainer)
        .expect(400);
      expect(error.error).toContain("validation failed");
    });
  });
  describe("/trainers/:username", () => {
    it("GET should respond with trainer details when correct trainer", async () => {
      const expectedTrainer = {
        username: "ash2"
      };
      jwt.verify.mockReturnValueOnce({ name: expectedTrainer.username });
      const { body: trainers } = await request(app)
        .get(`/trainers/${expectedTrainer.username}`)
        .set("Cookie", "token=valid-token")
        .expect(200);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(trainers[0]).toMatchObject(expectedTrainer);
    });

    it("GET should respond with incorrect trainer message when incorrrect trainer", async () => {
      const wrongTrainer = {
        username: "ash2"
      };
      jwt.verify.mockReturnValueOnce({ name: wrongTrainer.username });
      const { body: error } = await request(app)
        .get(`/trainers/ash1`)
        .set("Cookie", "token=valid-token")
        .expect(403);
      expect(error).toEqual({ error: "Incorrect trainer!" });
    });
    it("GET should deny access when there is no token", async () => {
      const { body: error } = await request(app)
        .get("/trainers/ash2")
        .expect(401);
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(error).toEqual({ error: "You are not authorized" });
    });
    it.only("GET should deny access when token is invalid", async () => {
      const errorMessage = "Hahaha your Token is invalid";
      jwt.verify.mockReturnValueOnce(() => {
        throw new Error(errorMessage);
      });
      const { body: error } = await request(app)
        .get("/trainers/ash2")
        .set("Cookie", "token=invalid-token")
        .expect(403);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      // expect(error.error).toEqual(errorMessage);
    });
  });
  describe("/trainers/login", () => {
    it("POST should login when password is correct", async () => {
      const correctTrainer = {
        username: "ash2",
        password: "IwantobetheverybesT"
      };
      const { text: message } = await request(app)
        .post("/trainers/login")
        .send(correctTrainer)
        .expect(200);
      expect(message).toEqual("You are now logged in!");
    });
    it("POST should not login when password is wrong", async () => {
      const correctTrainer = {
        username: "ash2",
        password: "IwantobetheverybesTtt"
      };
      const { body: message } = await request(app)
        .post("/trainers/login")
        .send(correctTrainer)
        .expect(400);
      expect(message).toEqual({ error: "Login failed" });
    });
  });
});
