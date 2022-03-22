const app = require("../app");
const request = require("supertest");
const { sequelize, Dealer, Car } = require("../models");
const { queryInterface } = sequelize;
const { login, getDealer } = require("../controllers/dealerController");
const { getCars } = require("../controllers/carController");

const transporter = require("../helpers/nodemailer");
jest.mock("../helpers/nodemailer", () => {
  return { sendMail: jest.fn((option, cb) => cb("error boss", null)) };
});

let access_token;


describe("Register dealer routes", () => {
  beforeAll((done) => {
    let data = {
      name: "Ford Mustang G5",
      description: "This is sport car",
      fuel: "Solar",
      seats: 2,
      mileage: 12000,
      price: 1000000,
      color: "black",
      yearMade: "1989-04-23T18:25:43.511Z",
      TypeId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    queryInterface
      .bulkInsert("Cars", [data], {})
      .then((res) => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  
  afterAll((done) => {
    queryInterface
      .bulkDelete("Cars", null, {})
      .then((res) => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  
  describe("POST /dealers/register - success test", () => {
    let newDealer = {
      name: "Dealer",
      email: "dealer@mail.com",
      password: "12345",
      phoneNumber: "081312849392",
      storeName: "Cars",
      storeAddress: "Jakarta",
    };

    beforeEach(async () => {
      await Dealer.destroy({
        where: { email: newDealer.email },
      });
    });

    test("should return correct response (201) when input is correct", (done) => {
      request(app)
        .post("/dealers/register")
        .send(newDealer)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(201);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("id", expect.any(Number));
          expect(res.body).toHaveProperty("email", newDealer.email);
          expect(res.body).toHaveProperty("name", newDealer.name);
          done();
        });
    });

    test("should return console log error when failed to send email", (done) => {
      const sendMockDeal = jest.fn((_, cb) => cb(null, true));
      transporter.sendMail.mockImplementationOnce(sendMockDeal);
      request(app)
        .post("/dealers/register")
        .send(newDealer)
        .end(function (err, res) {
          if (err) done(err);
          expect(sendMockDeal).toHaveBeenCalled();
          done();
        });
    });
  });

  describe("POST /dealers/register - failed test", () => {
    test("should return correct response (400) when name is not inputted", (done) => {
      request(app)
        .post("/dealers/register")
        .send({
          email: "dealer@mail.com",
          password: "12345",
          phoneNumber: "081312849392",
          storeName: "Cars",
          storeAddress: "Jakarta",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        });
    });

    test("should return correct response (400) when email is not inputted", (done) => {
      request(app)
        .post("/dealers/register")
        .send({
          name: "Dealer",
          password: "12345",
          phoneNumber: "081312849392",
          storeName: "Cars",
          storeAddress: "Jakarta",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        });
    });

    test("should return correct response (400) when email is not valid", (done) => {
      request(app)
        .post("/dealers/register")
        .send({
          name: "Dealer",
          email: "dealer_mail_com",
          password: "12345",
          phoneNumber: "081312849392",
          storeName: "Cars",
          storeAddress: "Jakarta",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        });
    });

    test("should return correct response (400) when email is duplicate", (done) => {
      request(app)
        .post("/dealers/register")
        .send({
          name: "Dealer",
          email: "dealer@mail.com",
          password: "12345",
          phoneNumber: "081312849392",
          storeName: "Cars",
          storeAddress: "Jakarta",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        });
    });

    test("should return correct response (400) when password is not inputted", (done) => {
      request(app)
        .post("/dealers/register")
        .send({
          name: "Dealer",
          email: "dealer@mail.com",
          phoneNumber: "0913245678",
          storeName: "Cars",
          storeAddress: "Jakarta",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        });
    });

    test("should return correct response (400) when password less than 5 character", (done) => {
      request(app)
        .post("/dealers/register")
        .send({
          name: "Dealer",
          email: "dealer@mail.com",
          phoneNumber: "0913245678",
          password: "1234",
          storeName: "Cars",
          storeAddress: "Jakarta",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        });
    });

    test("should return correct response (400) when phone number is not inputted", (done) => {
      request(app)
        .post("/dealers/register")
        .send({
          name: "Dealer",
          email: "dealer@mail.com",
          password: "12345",
          storeName: "Cars",
          storeAddress: "Jakarta",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        });
    });

    test("should return correct response (400) when store name is not inputted", (done) => {
      request(app)
        .post("/dealers/register")
        .send({
          name: "Dealer",
          email: "dealer@mail.com",
          phoneNumber: "08123456789",
          password: "12345",
          storeAddress: "Jakarta",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        });
    });

    test("should return correct response (400) when store address is not inputted", (done) => {
      request(app)
        .post("/dealers/register")
        .send({
          name: "Dealer",
          email: "dealer@mail.com",
          password: "12345",
          storeName: "Cars",
          phoneNumber: "08123456733",
        })
        .end(function (err, res) {
          if (err) done(err);
          expect(res.status).toBe(400);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        });
    });
  });
});

describe("Dealer get routes", () => {
  describe("GET /dealers/:id - success test", () => {
    beforeEach((done) => {
      let data = [
        {
          id: 3,
          name: "Dealer",
          email: "test@mail.com",
          password: "12345",
          phoneNumber: "081312849392",
          storeName: "Cars",
          storeAddress: "Jakarta",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      queryInterface
        .bulkInsert("Dealers", data, {})
        .then((res) => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    afterEach(async () => {
      await Dealer.destroy({
        where: {
          email: "test@mail.com",
        },
      });
    });
    it("should return correct response (200) when there is dealer with provided id", (done) => {
      request(app)
        .get("/dealers/3")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Object);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("GET /dealers/:id -- failed test", () => {
    test("should return correct response (401) when dealer is not registered", async () => {
      const mReq = { params: { id: 200 } };
      const mRes = {};
      const mNext = jest.fn();
      await login(mReq, mRes, mNext);
      expect(mNext).toBeCalledWith(expect.anything());
    });

    test("should return correct response (404) when there is no dealer", (done) => {
      request(app)
        .get("/dealers/1000")
        .then((res) => {
          expect(res.status).toBe(404);
          done();
        })
        .catch((err) => done(err));
    });
  });
});

describe("Dealer login routes", () => {
  describe("POST /dealers/login - success test", () => {
    let dealer = {
      email: "dealer@mail.com",
      password: "12345",
    };

    it("should return correct response (200) when input is correct and user is registered", (done) => {
      request(app)
        .post("/dealers/login")
        .send(dealer)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", expect.any(String));
          expect(res.body).toHaveProperty("access_token", expect.any(String));
          access_token = res.body.access_token;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("POST /dealers/login - failed test", () => {
    test("should return correct response (401) when dealer is not registered", async () => {
      const mReq = { body: { email: "test@mail.com", password: "12345" } };
      const mRes = {};
      const mNext = jest.fn();
      await login(mReq, mRes, mNext);
      expect(mNext).toBeCalledWith(expect.anything());
    });

    test("should return correct response (401) when dealer password is not correct", async () => {
      const mReq = { body: { email: "dealer@mail.com", password: "12" } };
      const mRes = {};
      const mNext = jest.fn();
      await login(mReq, mRes, mNext);
      expect(mNext).toBeCalledWith(expect.anything());
    });
  });
});

// Car test

describe("Car routes", () => {
  beforeAll((done) => {
    let data = {
      name: "Ford Mustang G5",
      description: "This is sport car",
      fuel: "Solar",
      seats: 2,
      mileage: 12000,
      price: 1000000,
      color: "black",
      yearMade: "1989-04-23T18:25:43.511Z",
      TypeId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    queryInterface
      .bulkInsert("Cars", [data], {})
      .then((res) => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  
  afterAll((done) => {
    queryInterface
      .bulkDelete("Cars", null, {})
      .then((res) => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  
  describe("GET /cars - success test", () => {
    it("should return correct response (200) with cars data", (done) => {
      request(app)
        .get("/cars?page=1&maxItem=6")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Array);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("GET /cars -- failed test", () => {
    test("should return correct response (500) when hit error", async () => {
      const mReq = { body: { email: "test@mail.com", password: "12345" } };
      const mRes = {};
      const mNext = jest.fn();
      await getCars(mReq, mRes, mNext);
      expect(mNext).toBeCalledWith(expect.anything());
      expect(mRes).toBeInstanceOf(Object);
    });
  });

  describe("GET /cars/:id - success test", () => {
    beforeEach((done) => {
      let data = [
        {
          id: 3,
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      queryInterface
        .bulkInsert("Cars", data, {})
        .then((res) => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    afterEach((done) => {
      queryInterface
        .bulkDelete("Cars", null, {})
        .then((res) => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("should return correct response (200) if car with id is in database", (done) => {
      request(app)
        .get(`/cars/3`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("id", expect.any(Number));
          expect(res.body).toHaveProperty("Type", expect.any(Object));
          expect(res.body).toHaveProperty("Dealer", expect.any(Object));
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("GET /cars/:id - failed test", () => {
    test("should return correct response (404) when car is not found", (done) => {
      request(app)
        .get(`/cars/100`)
        .then((res) => {
          expect(res.status).toBe(404);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("POST /cars - success test", () => {
    beforeEach(async () => {
      await Car.destroy({
        where: {
          id: 1,
        },
      });
    });
    test("should return correct response (201) when car is created", (done) => {
      request(app)
        .post("/cars")
        .send({
          name: "Ford Mustang Gt-5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(201);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        })
        .catch((err) => {
          console.log(err);
          done(err);
        });
    });
  });

  describe("POST /cars - failed test", () => {
    test("should return correct response (400) when name field is missing", (done) => {
      request(app)
        .post("/cars")
        .send({
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "Car name is required");
          done();
        })
        .catch((err) => {
          console.log(accesstoken, "disini");
          done(err);
        });
    });

    test("should return correct response (400) when description is missing", (done) => {
      request(app)
        .post("/cars")
        .send({
          name: "Ford Mustang G5",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "Description is required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (400) when fuel field is missing", (done) => {
      request(app)
        .post("/cars")
        .send({
          name: "Ford Mustang G5",
          description: "This is sport car",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "Fuel is required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (400) when seats field is missing", (done) => {
      request(app)
        .post("/cars")
        .send({
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "Seats is required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (400) when mileage field is missing", (done) => {
      request(app)
        .post("/cars")
        .send({
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "Mileage is required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (400) when price field is missing", (done) => {
      request(app)
        .post("/cars")
        .send({
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "Price is required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (400) when color field is missing", (done) => {
      request(app)
        .post("/cars")
        .send({
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "Color is required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (400) when year make is missing", (done) => {
      request(app)
        .post("/cars")
        .send({
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "Make Year is required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (400) when there is no image", (done) => {
      request(app)
        .post("/cars")
        .send({
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: [],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "Image is required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (400) when type id field is missing", (done) => {
      request(app)
        .post("/cars")
        .send({
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "Type is required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (400) when access token is not provided", (done) => {
      request(app)
        .post("/cars")
        .send({
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "jwt must be provided");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("DELETE /cars/:id - success test", () => {
    beforeEach((done) => {
      let data = [
        {
          id: 1,
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      queryInterface
        .bulkInsert("Cars", data, {})
        .then((res) => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    afterEach((done) => {
      queryInterface
        .bulkDelete("Cars", null, {})
        .then((res) => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("should return correct response (200) when product deleted successfully", (done) => {
      request(app)
        .delete("/cars/1")
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("DELETE /cars/:id - failed test", () => {
    test("should return correct response (404) when there is no product to delete", (done) => {
      request(app)
        .delete("/cars/10")
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("PUT /cars/:id - success test", () => {
    beforeEach((done) => {
      let data = [
        {
          id: 1,
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      queryInterface
        .bulkInsert("Cars", data, {})
        .then((res) => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (200) when car is updated", (done) => {
      request(app)
        .put("/cars/" + 1)
        .send({
          name: "Ford Mustang G5 edited",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        })
        .catch((err) => {
          console.log(err);
          done(err);
        });
    });
  });

  describe("PUT /cars/:id - failed test", () => {
    test("should return correct response (404) car is not found", (done) => {
      request(app)
        .put("/cars/10")
        .send({
          name: "Ford Mustang G5 edited",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: ["tes", "tes"],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty("message", expect.any(String));
          done();
        })
        .catch((err) => {
          console.log(err);
          done(err);
        });
    });

    test("should return correct response (400) when there is no image", (done) => {
      request(app)
        .put("/cars/1")
        .send({
          name: "Ford Mustang G5",
          description: "This is sport car",
          fuel: "Solar",
          seats: 2,
          mileage: 12000,
          price: 1000000,
          color: "black",
          yearMade: "1989-04-23T18:25:43.511Z",
          TypeId: 5,
          image: [],
        })
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message", "Image is required");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
