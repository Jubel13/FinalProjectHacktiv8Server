const app = require("../app");
const request = require("supertest");
const { sequelize, Buyer } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/bcrypt");
const { login } = require("../controllers/buyerController");

const transporter = require("../helpers/nodemailer");
jest.mock("../helpers/nodemailer", () => {
  return { sendMail: jest.fn((option, cb) => cb("error boss", null)) };
});

describe("Register buyer routes", () => {
  beforeAll((done) => {
    let data = [
      {
        username: "Arief",
        email: "arief.zhang21@gmail.com",
        password: hashPassword("12345"),
        address: "Jl. Bandung",
        phoneNumber: "0897867564",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    queryInterface
      .bulkInsert("Buyers", data, {})
      .then(() => done())
      .catch((err) => done(err));
  });

  afterAll((done) => {
    queryInterface
      .bulkDelete("Buyers", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
      })
      .then(() => done())
      .catch((err) => done(err));
  });

  describe("POST /buyers/register - success test", () => {
    let newUser = {
      username: "user1",
      email: "user1@mail.com",
      password: "12345",
      phoneNumber: "0897867564",
      address: "Bandung",
    };
    beforeEach((done) => {
      Buyer.destroy({
        where: { email: newUser.email },
      })
        .then(() => done())
        .catch((err) => done(err));
    });

    test("Should return response (201) when input is correct", (done) => {
      request(app)
        .post("/buyers/register")
        .send(newUser)
        .end(function (err, res) {
          if (err) done(err);

          expect(res.status).toBe(201);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("id", expect.any(Number));
          expect(res.body).toHaveProperty("name", newUser.username);
          expect(res.body).toHaveProperty("email", newUser.email);
          done();
        });
    });

    test("should return console log error when failed to send email", (done) => {
      const sendMock = jest.fn((_, cb) => cb(null, true));
      transporter.sendMail.mockImplementationOnce(sendMock);
      request(app)
        .post("/buyers/register")
        .send(newUser)
        .end(function (err, res) {
          if (err) done(err);
          expect(sendMock).toHaveBeenCalled();
          done();
        });
    });
  });

  describe("POST /buyers/register - failed test", () => {
    test("should return correct response (400) when username is not inputted", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          email: "user1@mail.com",
          password: "12345",
          phoneNumber: "0897867564",
          address: "Bandung",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Username is required");
          done();
        });
    });

    test("should return correct response (400) when username is null", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: null,
          email: "user1@mail.com",
          password: "12345",
          phoneNumber: "0897867564",
          address: "Bandung",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Username is required");
          done();
        });
    });
  });

  describe("POST /buyers/register - failed test", () => {
    test("should return correct response (400) when email is not inputted", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: "user1",
          password: "12345",
          phoneNumber: "0897867564",
          address: "Bandung",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Email is required");
          done();
        });
    });

    test("should return correct response (400) when email is null", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: "user1",
          email: null,
          password: "12345",
          phoneNumber: "0897867564",
          address: "Bandung",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Email is required");
          done();
        });
    });
  });

  describe("POST /buyers/register - failed test", () => {
    test("should return correct response (400) when email is not valid", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: "user1",
          email: "user1mail.com",
          password: "12345",
          phoneNumber: "0897867564",
          address: "Bandung",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Must be an email format");
          done();
        });
    });
  });

  describe("POST /buyers/register - failed test", () => {
    test("should return correct response (400) when email is duplicate", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: "user1",
          email: "arief.zhang21@gmail.com",
          password: "12345",
          phoneNumber: "0897867564",
          address: "Bandung",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Email must be unique");
          done();
        });
    });
  });

  describe("POST /buyers/register - failed test", () => {
    test("should return correct response (400) when password is not inputted", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: "user1",
          email: "user1@mail.com",
          phoneNumber: "0897867564",
          address: "Bandung",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Password is required");
          done();
        });
    });

    test("should return correct response (400) when password is null", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: "user1",
          email: "user1@mail.com",
          password: null,
          phoneNumber: "0897867564",
          address: "Bandung",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Password is required");
          done();
        });
    });
  });

  describe("POST /buyers/register - failed test", () => {
    test("should return correct response (400) when password less than 5 character", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: "user1",
          email: "user1@mail.com",
          password: "1234",
          phoneNumber: "0897867564",
          address: "Bandung",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Password must be at least 5 character"
          );
          done();
        });
    });
  });

  describe("POST /buyers/register - failed test", () => {
    test("should return correct response (400) when phone number is not inputted", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: "user1",
          email: "user1@mail.com",
          password: "12345",
          address: "Bandung",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Phone is required");
          done();
        });
    });

    test("should return correct response (400) when phone number is null", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: "user1",
          email: "user1@mail.com",
          password: "12345",
          phoneNumber: null,
          address: "Bandung",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Phone is required");
          done();
        });
    });
  });

  describe("POST /buyers/register - failed test", () => {
    test("should return correct response (400) when address is not inputted", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: "user1",
          email: "user1@mail.com",
          password: "12345",
          phoneNumber: "0897867564",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Address is required");
          done();
        });
    });

    test("should return correct response (400) when address is not null", (done) => {
      request(app)
        .post("/buyers/register")
        .send({
          username: "user1",
          email: "user1@mail.com",
          password: "12345",
          phoneNumber: "0897867564",
          address: null,
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Address is required");
          done();
        });
    });
  });
});

describe("Buyer login routes", () => {
  beforeAll((done) => {
    let data = [
      {
        username: "Arief",
        email: "arief.zhang21@gmail.com",
        password: hashPassword("12345"),
        address: "Jl. Bandung",
        phoneNumber: "0897867564",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    queryInterface
      .bulkInsert("Buyers", data, {})
      .then(() => done())
      .catch((err) => done(err));
  });

  afterAll((done) => {
    queryInterface
      .bulkDelete("Buyers", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
      })
      .then(() => done())
      .catch((err) => done(err));
  });

  describe("POST /buyers/login - success test", () => {
    it("should return correct response (200) when input is correct and buyer already registered", (done) => {
      request(app)
        .post("/buyers/login")
        .send({
          email: "arief.zhang21@gmail.com",
          password: "12345",
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Login as Buyer successfull"
          );
          expect(res.body).toHaveProperty("access_token", expect.any(String));
          access_token = res.body.access_token;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("POST /buyers/login - failed test", () => {
    test("should return correct response (401) when buyer is not registered", (done) => {
      request(app)
        .post("/buyers/login")
        .send({
          email: "test@test.com",
          password: "12345",
        })
        .then((res) => {
          expect(res.status).toBe(401);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Invalid email or password"
          );
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (401) when buyer is not registered", async () => {
      const mReq = { body: { email: "test@mail.com", password: "12345" } };
      const mRes = {};
      const mNext = jest.fn();
      await login(mReq, mRes, mNext);
      expect(mNext).toBeCalledWith(expect.anything());
    });

    test("should return correct response (401) when buyer password is not correct", async () => {
      const mReq = { body: { email: "buyer@mail.com", password: "12" } };
      const mRes = {};
      const mNext = jest.fn();
      await login(mReq, mRes, mNext);
      expect(mNext).toBeCalledWith(expect.anything());
    });

    test("should return correct response (401) when buyers password is not correct", (done) => {
      request(app)
        .post("/buyers/login")
        .send({
          email: "arief.zhang21@gmail.com",
          password: "98765",
        })
        .then((res) => {
          expect(res.status).toBe(401);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Invalid email or password"
          );
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
