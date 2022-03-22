const app = require("../app");
const request = require("supertest");
const { sequelize, Car, Dealer } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

jest.mock("../API/snap_MidtransAPI", () => {
  return {
    createTransaction: () => {
      return new Promise((resolve) => {
        resolve({
          message: "Please check your payment.",
          token: "5ba020e1-0a3c-4140-8090-896f1671319f",
          redirect_url:
            "https://app.sandbox.midtrans.com/snap/v2/vtweb/5ba020e1-0a3c-4140-8090-896f1671319f",
        });
      });
    },
  };
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

  let access_token3 = generateToken(buyerPayload3);

  let access_token4 = generateToken(buyerPayload4);

  const invalidToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIwMUBtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE2MjI2MDk2NTF9.gShAB2qaCUjlnvNuM1MBWfBVEjDGdqjWSJNMEScXIeE";

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

    // let brand = {
    //   name: "Ford",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // };

    // let type = {
    //   modelName: "Sedan",
    //   BrandId: 1,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // };

    queryInterface
      .bulkDelete("Cars", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
      })
      .then(() => {
        return queryInterface.bulkInsert("Buyers", data, {});
      })
      .then(() => {
        return Dealer.create(dealer);
      })
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
      .then(() => {
        return queryInterface.bulkDelete("Dealers", null, {
          truncate: true,
          cascade: true,
          restartIdentity: true,
        });
      })
      .then(() => {
        return queryInterface.bulkDelete("Cars", null, {
          truncate: true,
          cascade: true,
          restartIdentity: true,
        });
      })
      .then(() => done())
      .catch((err) => done(err));
  });

  describe("POST /payments - Success Test", () => {
    beforeEach((done) => {
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
