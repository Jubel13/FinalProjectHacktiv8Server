const app = require("../app");
const request = require("supertest");
const {
  sequelize,
  BoughtHistory,
  Buyer,
  Car,
  Dealer,
  Type,
  Brand,
} = require("../models");
const { queryInterface } = sequelize;
const { Op } = sequelize;
const { hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { format, add } = require("date-fns");
const { core } = require("../API/MidtransAPI");
// const midtransClient = require("midtrans-client");
const AUTHORIZATION = process.env.AUTHORIZATION;
const CLIENT_KEY = process.env.CLIENT_KEY;

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
    {
      username: "Jubel",
      email: "jubelsinaga13@gmail.com",
      password: hashPassword("12345"),
      address: "Jl. Medan",
      phoneNumber: "0876543210",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  queryInterface
    .bulkInsert("Buyers", data, {})
    .then(() => done())
    .catch((err) => done(err));

  let dealer = {
    name: "Fida",
    phoneNumber: "0897867564",
    email: "fida@gmail.com",
    password: "12345",
    storeName: "Car-Tique",
    storeAddress: "Jl. Jakarta",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let brand = {
    name: "Ford",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let type = {
    modelName: "Sedan",
    BrandId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  Dealer.create(dealer)
    .then(() => done())
    .catch((err) => done(err));

  queryInterface
    .bulkInsert("Brands", [brand], {})
    .then(() => done())
    .catch((err) => done(err));

  queryInterface
    .bulkInsert("Types", [type], {})
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

  queryInterface
    .bulkDelete("Dealers", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    })
    .then(() => done())
    .catch((err) => done(err));

  queryInterface
    .bulkDelete("Types", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    })
    .then(() => done())
    .catch((err) => done(err));

  queryInterface
    .bulkDelete("Brands", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    })
    .then(() => done())
    .catch((err) => done(err));
});

describe("Register buyer routes", () => {
  describe("POST /buyers/register - success test", () => {
    let newUser = {
      username: "user1",
      email: "user1@mail.com",
      password: "12345",
      phoneNumber: "0897867564",
      address: "Bandung",
    };
    beforeEach((done) => {
      Dealer.destroy({
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
    test("should return correct response (400) when store address is not inputted", (done) => {
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

    test("should return correct response (400) when store address is not null", (done) => {
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
  describe("POST /buyers/login - success test", () => {
    let buyer = {
      email: "arief.zhang21@gmail.com",
      password: "12345",
    };

    it("should return correct response (200) when input is correct and buyer is registered", (done) => {
      request(app)
        .post("/buyers/login")
        .send(buyer)
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
          console.log(res.body, "<<<<<<<<<<<<<<<<< RES BODY");
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

describe("Payment transaction from buyer using full payment", () => {
  const payload = {
    quantity: 1,
    carId: 1,
    notes: "Full Payment",
  };

  const buyerPayload = {
    id: 1,
    username: "Arief",
    email: "arief.zhang21@gmail.com",
    address: "Jl. Bandung",
    phoneNumber: "0897867564",
  };

  const buyerPayload2 = {
    id: 2,
    username: "Jubel",
    email: "jubelsinaga13@gmail.com",
    address: "Jl. Medan",
    phoneNumber: "0876543210",
  };

  const buyerPayload3 = {
    id: 999,
    username: "Joker",
    email: "joker@joker.com",
    address: "Paradise",
    phoneNumber: "0XXXXXXXX0",
  };

  const buyerPayload4 = {
    id: 1,
    username: "Arief",
    address: "Jl. Bandung",
    phoneNumber: "0897867564",
  };

  let access_token = generateToken(buyerPayload);

  let access_token2 = generateToken(buyerPayload2);

  let access_token3 = generateToken(buyerPayload3);

  let access_token4 = generateToken(buyerPayload4);

  const invalidToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIwMUBtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE2MjI2MDk2NTF9.gShAB2qaCUjlnvNuM1MBWfBVEjDGdqjWSJNMEScXIeE";

  describe("POST /payments - Success Test", () => {
    beforeAll((done) => {
      let car = {
        name: "Mustang G5",
        description: "This is sport car",
        fuel: "Solar",
        seats: 2,
        mileage: 12000,
        price: 1000000000,
        color: "black",
        DealerId: 1,
        yearMade: "1989-04-23T18:25:43.511Z",
        TypeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      Car.create(car)
        .then(() => done())
        .catch((err) => done(err));
    });

    test("should return an Object with token and redirect url from Midtrans", (done) => {
      request(app)
        .post("/payments")
        .set("access_token", access_token)
        .send(payload)
        .end((err, res) => {
          if (err) done(err);

          console.log(res.body, "<<<<<<<<<<<< RES BODY");
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Please check your payment."
          );
          expect(res.body).toHaveProperty("token", expect.any(String));
          expect(res.body).toHaveProperty("redirect_url", expect.any(String));
          done();
        });
    });
  });

  describe("POST /payments - Failed Test Part.1", () => {
    let payload1 = {
      carId: 1,
      notes: "Full Payment",
    };

    let payload2 = {
      quantity: 1,
      carId: 1,
      notes: "Full Payment",
    };

    let payload3 = {
      quantity: 1,
      notes: "Full Payment",
    };

    test("If client didn't send quantity in req.body should return an Object with message 'Quantity can't be empty.'", (done) => {
      request(app)
        .post("/payments")
        .set("access_token", access_token)
        .send(payload1)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Quantity can't be empty."
          );
          done();
        });
    });

    test("If client didn't send car Id in req.body should return an Object with message 'Car ID can't be empty.'", (done) => {
      request(app)
        .post("/payments")
        .set("access_token", access_token)
        .send(payload3)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Car ID can't be empty.");
          done();
        });
    });

    test("If buyer ID didn't in database should return an Object with message 'Invalid token or user'", (done) => {
      request(app)
        .post("/payments")
        .set("access_token", access_token3)
        .send({
          quantity: 1,
          carId: 1,
          notes: "Full Payment",
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).toBe(401);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Invalid token or user");
          done();
        });
    });

    test("If buyer using invalid token should return an Object with message 'Invalid token or user'", (done) => {
      request(app)
        .post("/payments")
        .set("access_token", invalidToken)
        .send({
          quantity: 1,
          carId: 1,
          notes: "Full Payment",
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "invalid signature");
          done();
        });
    });

    test("If buyer use payload with null email should return an Object with message 'Invalid token or user'", (done) => {
      request(app)
        .post("/payments")
        .set("access_token", access_token4)
        .send({
          quantity: 1,
          carId: 1,
          notes: "Full Payment",
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).toBe(401);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Invalid token or user");
          done();
        });
    });

    test("If car ID didn't in database should return an Object with message 'Car not found.'", (done) => {
      request(app)
        .post("/payments")
        .set("access_token", access_token)
        .send({
          quantity: 1,
          carId: 700,
          notes: "Full Payment",
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).toBe(404);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Car not found.");
          done();
        });
    });
  });

  describe("POST /payments - Failed Test Part.2", () => {
    beforeAll((done) => {
      Car.update(
        {
          status: "sold",
        },
        {
          where: {
            id: 1,
          },
        }
      )
        .then(() => done())
        .catch((err) => done(err));
    });

    afterAll((done) => {
      Car.update(
        {
          status: "sale",
        },
        {
          where: {
            id: 1,
          },
        }
      )
        .then(() => done())
        .catch((err) => done(err));
    });

    test("If car status was 'sold' in database should return an Object with message 'Car not found.'", (done) => {
      request(app)
        .post("/payments")
        .set("access_token", access_token)
        .send({
          quantity: 1,
          carId: 1,
          buyerId: 1,
          notes: "Full Payment",
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(404);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Car not found.");
          done();
        });
    });
  });

  describe("POST /payments - Failed Test Part.3", () => {
    beforeAll((done) => {
      Car.update(
        {
          status: "pending",
        },
        {
          where: {
            id: 1,
          },
        }
      )
        .then(() => done())
        .catch((err) => done(err));
    });

    afterAll((done) => {
      Car.update(
        {
          status: "sale",
        },
        {
          where: {
            id: 1,
          },
        }
      )
        .then(() => done())
        .catch((err) => done(err));
    });

    test("If car status was 'pending' in database should return an Object with message 'Car status pending payment for other transaction.'", (done) => {
      request(app)
        .post("/payments")
        .set("access_token", access_token)
        .send({
          quantity: 1,
          carId: 1,
          buyerId: 1,
          notes: "Full Payment",
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(403);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Car status pending payment for other transaction."
          );
          done();
        });
    });
  });

  describe("POST /payments - Failed Test Part.4", () => {
    test("If car already in another subscription in database should return an Object with message 'Car already in subcription with term.'", (done) => {
      request(app)
        .post("/payments")
        .set("access_token", access_token)
        .send({
          quantity: 1,
          carId: 1,
          buyerId: 1,
          notes: "Full Payment",
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(403);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Car already in subcription with term."
          );
          done();
        });
    });
  });
});

describe("Get all transaction from buyer by ID", () => {
  const buyerPayload = {
    id: 1,
    username: "Arief",
    email: "arief.zhang21@gmail.com",
    address: "Jl. Bandung",
    phoneNumber: "0897867564",
  };

  const buyerPayload2 = {
    id: 2,
    username: "Jubel",
    email: "jubelsinaga13@gmail.com",
    address: "Jl. Medan",
    phoneNumber: "0876543210",
  };

  let access_token = generateToken(buyerPayload);

  let access_token2 = generateToken(buyerPayload2);

  describe("GET /payments/status - Success Test", () => {
    test("Should return an Array of bought history", (done) => {
      request(app)
        .get("/payments/status?BuyerId=" + 1)
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body[0]).toBeInstanceOf(Object);
          expect(res.body[0]).toHaveProperty("id", expect.any(Number));
          expect(res.body[0]).toHaveProperty("carName", expect.any(String));
          expect(res.body[0]).toHaveProperty("description", expect.any(String));
          expect(res.body[0]).toHaveProperty("boughtDate", expect.any(String));
          expect(res.body[0]).toHaveProperty("paidOff", expect.any(Boolean));
          expect(res.body[0]).toHaveProperty("price", expect.any(Number));
          expect(res.body[0]).toHaveProperty("BuyerId", expect.any(Number));
          expect(res.body[0]).toHaveProperty("orderId", expect.any(String));
          expect(res.body[0]).toHaveProperty(
            "installment",
            expect.any(Boolean)
          );
          expect(res.body[0]).toHaveProperty(
            "currentInstallment",
            expect.any(Number)
          );
          done();
        });
    });
  });

  describe("GET /payments/status - Failed Test", () => {
    test("If client didn't send buyer Id in req.query should return an Object with message 'Buyer ID can't be empty.'", (done) => {
      request(app)
        .get("/payments/status")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Buyer ID can't be empty."
          );
          done();
        });
    });

    test("If buyer didn't in database should return an Object with message 'Buyer not found.'", (done) => {
      request(app)
        .get("/payments/status?BuyerId=" + 100)
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(404);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Buyer not found.");
          done();
        });
    });

    test("If buyer hasn't have any bought history should return an Object with message 'Bought history not found.'", (done) => {
      request(app)
        .get("/payments/status?BuyerId=" + 2)
        .set("access_token", access_token2)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(404);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Bought history not found."
          );
          done();
        });
    });
  });
});

describe("Update status payment after transaction payment was confirm from Midtrans", () => {
  const buyerPayload = {
    id: 1,
    username: "Arief",
    email: "arief.zhang21@gmail.com",
    address: "Jl. Bandung",
    phoneNumber: "0897867564",
  };

  const buyerPayload2 = {
    id: 2,
    username: "Jubel",
    email: "jubelsinaga13@gmail.com",
    address: "Jl. Medan",
    phoneNumber: "0876543210",
  };

  let access_token = generateToken(buyerPayload);

  let access_token2 = generateToken(buyerPayload2);

  beforeEach((done) => {
    Car.update(
      {
        status: "sale",
      },
      {
        where: {
          id: 1,
        },
      }
    )
      .then(() => done())
      .catch((err) => done(err));
  });

  describe("PATCH /payments/update/:id - Success Test", () => {
    test("Should return an Object with message 'Payment status already updated.'", (done) => {
      request(app)
        .patch("/payments/update/" + 1)
        .set("access_token", access_token)
        .send({
          CarId: 1,
          saved_token_id: "521111xQySBnVPMTomuTNIowOmJi1117",
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Payment status already updated."
          );
          done();
        });
    });
  });

  describe("PATCH /payments/update/:id - Failed Test", () => {
    test("If client didn't send buyer Id in req.params should return an Object with message 'Buyer ID can't be empty.'", (done) => {
      request(app)
        .patch("/payments/update/")
        .set("access_token", access_token)
        .send({
          CarId: 1,
          saved_token_id: "521111xQySBnVPMTomuTNIowOmJi1117",
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Buyer ID can't be empty."
          );
          done();
        });
    });

    test("If client didn't send car Id should return an Object with message 'Car ID can't be empty.'", (done) => {
      request(app)
        .patch("/payments/update/1")
        .set("access_token", access_token)
        .send({
          saved_token_id: "521111xQySBnVPMTomuTNIowOmJi1117",
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Car ID can't be empty.");
          done();
        });
    });

    test("If client send car Id that hasn't bought yet should return an Object with message 'Please check your input update payment.'", (done) => {
      request(app)
        .patch("/payments/update/1")
        .set("access_token", access_token)
        .send({
          CarId: 50,
          saved_token_id: "521111xQySBnVPMTomuTNIowOmJi1117",
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Please check your input update payment."
          );
          done();
        });
    });

    test("If client send car Id that hasn't bought yet should return an Object with message 'Please check your input update payment.'", (done) => {
      request(app)
        .patch("/payments/update/1")
        .set("access_token", access_token)
        .send({
          CarId: 50,
          saved_token_id: "521111xQySBnVPMTomuTNIowOmJi1117",
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Please check your input update payment."
          );
          done();
        });
    });
  });
});

describe("Installment for first payment", () => {
  jest.mock("../API/MidtransAPI", () => jest.fn());

  const buyerPayload = {
    id: 1,
    username: "Arief",
    email: "arief.zhang21@gmail.com",
    address: "Jl. Bandung",
    phoneNumber: "0897867564",
  };

  const buyerPayload2 = {
    id: 2,
    username: "Jubel",
    email: "jubelsinaga13@gmail.com",
    address: "Jl. Medan",
    phoneNumber: "0876543210",
  };

  let access_token = generateToken(buyerPayload);

  let access_token2 = generateToken(buyerPayload2);

  let token_id;

  let invalid_token_id = "521111-1117-df8d8c71-91e9-417f-b97e-45717194084e";

  beforeAll((done) => {
    (core) =>
      jest.fn(() => {
        return {
          cardToken: () => {
            return new Promise((resolve) => {
              resolve({
                status_code: "200",
                status_message: "Credit card token is created as Token ID.",
                token_id: "521111-1117-df8d8c71-91e9-417f-b97e-45717194084e",
                hash: "521111-1117-mami",
              });
            });
          },
        };
      });

    let car = {
      name: "Mustang G5",
      description: "This is sport car",
      fuel: "Solar",
      seats: 2,
      mileage: 12000,
      price: 1000000000,
      color: "black",
      DealerId: 1,
      yearMade: "1989-04-23T18:25:43.511Z",
      TypeId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    Car.create(car)
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach(async () => {
    await Car.update(
      {
        status: "sale",
      },
      {
        where: {
          id: 1,
        },
      }
    );
    await Car.update(
      {
        status: "sale",
      },
      {
        where: {
          id: 2,
        },
      }
    );

    let resp = await core.cardToken({
      client_key: CLIENT_KEY,
      card_number: "5211111111111117",
      card_exp_month: format(new Date(add(new Date(), { months: 10 })), "MM"),
      card_exp_year: format(new Date(add(new Date(), { years: 3 })), "yyyy"),
      card_cvv: "123",
    });

    token_id = resp.token_id;
  });

  describe("POST /payments/credits/:id - Success Test", () => {
    test("Should return an Object with message 'Success, Credit Card transaction is successful'", (done) => {
      request(app)
        .post("/payments/credits/" + 2)
        .set("access_token", access_token)
        .send({
          token_id,
          term: 12,
          dp: 200000000,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Success, Credit Card transaction is successful"
          );
          expect(res.body).toHaveProperty("paymentUrl", expect.any(String));
          done();
        });
    });
  });

  describe("POST /payments/credits/:id - Failed Test Part.1", () => {
    test("If client didn't send buyer Id in req.params should return an Object with message 'Buyer ID can't be empty.'", (done) => {
      request(app)
        .post("/payments/credits/")
        .set("access_token", access_token)
        .send({
          token_id,
          term: 12,
          dp: 200000000,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Buyer ID can't be empty."
          );
          done();
        });
    });

    test("If client didn't send term in req.body should return an Object with message 'Term can't be empty.'", (done) => {
      request(app)
        .post("/payments/credits/" + 2)
        .set("access_token", access_token)
        .send({
          token_id,
          dp: 200000000,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Term can't be empty.");
          done();
        });
    });

    test("If client send term more than 60 in req.body should return an Object with message 'Term can't more than 60 times.'", (done) => {
      request(app)
        .post("/payments/credits/" + 2)
        .set("access_token", access_token)
        .send({
          token_id,
          term: 100,
          dp: 200000000,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Term can't more than 60 times."
          );
          done();
        });
    });

    test("If client didn't send down payment in req.body should return an Object with message 'Down Payment can't be empty.'", (done) => {
      request(app)
        .post("/payments/credits/" + 2)
        .set("access_token", access_token)
        .send({
          token_id,
          term: 12,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Down Payment can't be empty."
          );
          done();
        });
    });

    test("If client send down payment more than car price in req.body should return an Object with message 'Down Payment can't extent car price.'", (done) => {
      request(app)
        .post("/payments/credits/" + 2)
        .set("access_token", access_token)
        .send({
          token_id,
          term: 12,
          dp: 2000000000,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Down Payment can't extent car price."
          );
          done();
        });
    });

    test("If client didn't send token_id in req.body should return an Object with message 'Token ID can't be empty.'", (done) => {
      request(app)
        .post("/payments/credits/" + 2)
        .set("access_token", access_token)
        .send({
          term: 12,
          dp: 200000000,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Token ID can't be empty."
          );
          done();
        });
    });
  });

  describe("POST /payments/credits/:id - Failed Test Part.2", () => {
    beforeEach(async () => {
      await Car.update(
        {
          status: "sold",
        },
        {
          where: {
            id: 2,
          },
        }
      );
    });

    test("If client want to bought a car that has already sold should return an Object with message 'Car not found.'", (done) => {
      request(app)
        .post("/payments/credits/" + 2)
        .set("access_token", access_token)
        .send({
          token_id,
          term: 12,
          dp: 200000000,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(404);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Car not found.");
          done();
        });
    });

    test("If client want to bought a car that hasn't in database should return an Object with message 'Car not found.'", (done) => {
      request(app)
        .post("/payments/credits/" + 200)
        .set("access_token", access_token)
        .send({
          token_id,
          term: 12,
          dp: 200000000,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(404);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Car not found.");
          done();
        });
    });
  });

  describe("POST /payments/credits/:id - Failed Test Part.3", () => {
    beforeEach(async () => {
      await Car.update(
        {
          status: "pending",
        },
        {
          where: {
            id: 2,
          },
        }
      );
    });

    test("If client want to bought a car that has already sold should return an Object with message 'Car status pending payment for other transaction.'", (done) => {
      request(app)
        .post("/payments/credits/" + 2)
        .set("access_token", access_token)
        .send({
          token_id,
          term: 12,
          dp: 200000000,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Car status pending payment for other transaction."
          );
          done();
        });
    });
  });

  describe("POST /payments/credits/:id - Failed Test Part.4", () => {
    test("If client want to bought a car that has already sold should return an Object with message 'Car already in subcription with term.'", (done) => {
      request(app)
        .post("/payments/credits/" + 1)
        .set("access_token", access_token)
        .send({
          token_id,
          term: 12,
          dp: 200000000,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(403);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Car already in subcription with term."
          );
          done();
        });
    });
  });
});

describe("Installment for next payment", () => {
  jest.mock("../API/MidtransAPI", () => jest.fn());

  const buyerPayload = {
    id: 1,
    username: "Arief",
    email: "arief.zhang21@gmail.com",
    address: "Jl. Bandung",
    phoneNumber: "0897867564",
  };

  const buyerPayload2 = {
    id: 2,
    username: "Jubel",
    email: "jubelsinaga13@gmail.com",
    address: "Jl. Medan",
    phoneNumber: "0876543210",
  };

  let access_token = generateToken(buyerPayload);

  let token_id;

  beforeAll((done) => {
    (core) =>
      jest.fn(() => {
        return {
          cardToken: () => {
            return new Promise((resolve) => {
              resolve({
                status_code: "200",
                status_message: "Credit card token is created as Token ID.",
                token_id: "521111-1117-df8d8c71-91e9-417f-b97e-45717194084e",
                hash: "521111-1117-mami",
              });
            });
          },
        };
      });

    (core) =>
      jest.fn(() => {
        return {
          getSubscription: () => {
            return new Promise((resolve) => {
              resolve({
                id: "4fcc7e07-264e-480a-8380-c083a5d5e206",
                name: "MONTHLY_2021_1_OTOSIC-01-1647857284920-1",
                amount: "137333334",
                currency: "IDR",
                created_at: "2022-03-21 17:08:05",
                schedule: {
                  interval: 1,
                  current_interval: 0,
                  max_interval: 3,
                  interval_unit: "month",
                  start_time: "2022-04-20 05:08:04",
                  next_execution_at: "2022-04-20 05:08:04",
                },
                status: "active",
                token: "521111-1117-df8d8c71-91e9-417f-b97e-45717194084e",
                payment_type: "credit_card",
                transaction_ids: [],
                metadata: { description: "Recurring payment for Mustang G5" },
                customer_details: {
                  email: "arief.zhang21@gmail.com",
                  phone: "0897867564",
                },
              });
            });
          },
        };
      });

    (core) =>
      jest.fn(() => {
        return {
          updateSubscription: () => {
            return new Promise((resolve) => {
              resolve({
                message: "Subscription has been updated.",
              });
            });
          },
        };
      });

    let car = {
      name: "Mustang G5",
      description: "This is sport car",
      fuel: "Solar",
      seats: 2,
      mileage: 12000,
      price: 1000000000,
      color: "black",
      DealerId: 1,
      yearMade: "1989-04-23T18:25:43.511Z",
      TypeId: 1,
      subscriptionId: "4fcc7e07-264e-480a-8380-c083a5d5e206",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    Car.create(car)
      .then(() => done())
      .catch((err) => done(err));

    Car.update(
      {
        status: "sold",
      },
      {
        where: {
          id: 3,
        },
      }
    )
      .then(() => done())
      .catch((err) => done(err));

    BoughtHistory.create({
      carName: car.name,
      description: car.description,
      boughtDate: new Date(),
      paidOff: true,
      price: car.price,
      BuyerId: 1,
      orderId: "OTOSIC-0" + car.id + "-" + new Date().getTime() + "-0",
      CarId: 3,
      installment: true,
      currentInstallment: 1,
      totalInstallment: 3,
      saved_token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
    })
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach(async () => {
    let resp = await core.cardToken({
      client_key: CLIENT_KEY,
      token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
      card_cvv: "123",
    });

    token_id = resp.token_id;
  });

  describe("POST /payments/credits/cars - Success Test", () => {
    test("Should return an Object with message 'Success, Credit Card transaction is successful'", (done) => {
      request(app)
        .post("/payments/credits/cars")
        .set("access_token", access_token)
        .send({
          token_id,
          CarId: 3,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("paymentUrl", expect.any(String));
          done();
        });
    });
  });

  describe("POST /payments/credits/cars - Failed Test Part.1", () => {
    test("If client didn't send car Id in req.body should return an Object with message 'Car ID can't be empty.'", (done) => {
      request(app)
        .post("/payments/credits/cars")
        .set("access_token", access_token)
        .send({
          token_id,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Car ID can't be empty.");
          done();
        });
    });

    test("If client didn't send token Id in req.body should return an Object with message 'Token ID can't be empty.'", (done) => {
      request(app)
        .post("/payments/credits/cars")
        .set("access_token", access_token)
        .send({
          CarId: 3,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Token ID can't be empty."
          );
          done();
        });
    });

    test("If client didn't send token Id in req.body should return an Object with message 'Car not found.'", (done) => {
      request(app)
        .post("/payments/credits/cars")
        .set("access_token", access_token)
        .send({
          token_id,
          CarId: 300,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(404);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", "Car not found.");
          done();
        });
    });
  });

  describe("POST /payments/credits/cars - Failed Test Part.2", () => {
    beforeEach((done) => {
      BoughtHistory.create({
        carName: "Mustang G5",
        description: "This is sport car",
        boughtDate: new Date(),
        paidOff: true,
        price: 1000000000,
        BuyerId: 1,
        orderId: "OTOSIC-0" + 3 + "-" + new Date().getTime() + "-0",
        CarId: 3,
        installment: true,
        currentInstallment: 2,
        totalInstallment: 3,
        saved_token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
      })
        .then(() => done())
        .catch((err) => done(err));

      BoughtHistory.create({
        carName: "Mustang G5",
        description: "This is sport car",
        boughtDate: new Date(),
        paidOff: true,
        price: 1000000000,
        BuyerId: 1,
        orderId: "OTOSIC-0" + 3 + "-" + new Date().getTime() + "-0",
        CarId: 3,
        installment: true,
        currentInstallment: 3,
        totalInstallment: 3,
        saved_token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
      })
        .then(() => done())
        .catch((err) => done(err));
    });

    test("If buyer already finished installment should return an Object with message 'Car installment already finished.'", (done) => {
      request(app)
        .post("/payments/credits/cars")
        .set("access_token", access_token)
        .send({
          token_id,
          CarId: 3,
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).toBe(403);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Car installment already finished."
          );
          done();
        });
    });
  });
});
