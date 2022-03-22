const app = require("../app");
const request = require("supertest");
const getBrands = require("../controllers/brandController");
const { getType, getTypes } = require("../controllers/typeController");

describe("Brand routes", () => {
  describe("GET /brands -- success test", () => {
    test("should return correct response (200) when querying for brands", (done) => {
      request(app)
        .get("/brands?brand=Ford")
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

  describe("GET /brands -- failed test", () => {
    test("should return correct response (500) when hit error", async () => {
      const mReq = { body: { email: "test@mail.com", password: "12345" } };
      const mRes = {};
      const mNext = jest.fn();
      await getBrands(mReq, mRes, mNext);
      expect(mNext).toBeCalledWith(expect.anything());
      expect(mRes).toBeInstanceOf(Object);
    });
  });
});

describe("Types routes", () => {
  describe("GET /types -- success test", () => {
    test("should return correct response (200) when querying for types", (done) => {
      request(app)
        .get("/types?type=mustang")
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

  describe("GET /types -- failed test", () => {
    test("should return correct response (500) when hit error", async () => {
      const mReq = { body: { name: "admin" } };
      const mRes = {};
      const mNext = jest.fn();
      await getTypes(mReq, mRes, mNext);
      expect(mNext).toBeCalledWith(expect.anything());
      expect(mRes).toBeInstanceOf(Object);
    });
  });

  describe("GET /type/:id -- success test", () => {
    test("should return correct response (200) when querying for types by id", (done) => {
      request(app)
        .get("/types/1")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("Brand", expect.any(Object));
          expect(res.body).toHaveProperty("Cars", expect.any(Array));
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("GET /type/:id -- failed test", () => {
    test("should return correct response (404) when querying for types by id not found", (done) => {
      request(app)
        .get("/types/10000")
        .then((res) => {
          expect(res.status).toBe(404);
          expect(res.body).toBeInstanceOf(Object);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("should return correct response (500) when hit error", async () => {
      const mReq = { params: { id: 100 } };
      const mRes = {};
      const mNext = jest.fn();
      await getType(mReq, mRes, mNext);
      expect(mNext).toBeCalledWith(expect.anything());
      expect(mRes).toBeInstanceOf(Object);
    });
  });
});
