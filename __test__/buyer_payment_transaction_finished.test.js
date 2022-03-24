const app = require("../app");
const request = require("supertest");
const { Admin, Car, Dealer, sequelize } = require("../models");
const { queryInterface } = sequelize;
const { generateToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const core = require("../API/core_MidtransAPI");
const apiClient = require("../API/apiClient_MidtransAPI");
const CLIENT_KEY = process.env.CLIENT_KEY;

jest.mock("../API/core_MidtransAPI", () => {
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
    updateSubscription: () => {
      return new Promise((resolve) => {
        resolve({
          message: "Subscription has been updated.",
        });
      });
    },
    transaction: () => {
      return {
        status: () => {
          return new Promise((resolve) => {
            resolve({
              masked_card: "521111-1117",
              approval_code: "1647857298270",
              bank: "mandiri",
              eci: "02",
              saved_token_id: "521111xQySBnVPMTomuTNIowOmJi1117",
              saved_token_id_expired_at: "2023-12-31 07:00:00",
              channel_response_code: "00",
              channel_response_message: "Approved",
              three_ds_version: "1",
              transaction_time: "2022-03-21 17:08:05",
              gross_amount: "137333334.00",
              currency: "IDR",
              order_id: "OTOSIC-01-1647857284920-0",
              payment_type: "credit_card",
              signature_key:
                "4617891e168279f7d92032854619b61e6b7bbce8b5afc650b377cd1e4c111de1d919553ba5020e9362360141ceb28e5b729eb6745e0a22493ea553cca2ba9d06",
              status_code: "200",
              transaction_id: "df8d8c71-91e9-417f-b97e-45717194084e",
              transaction_status: "settlement",
              fraud_status: "accept",
              settlement_time: "2022-03-22 16:51:08",
              status_message: "Success, transaction is found",
              merchant_id: "G357391545",
              card_type: "debit",
            });
          });
        },
      };
    },
  };
});

const adminPayload = {
  id: 1,
  name: "Fida",
  email: "fida@gmail.com",
  role: "admin",
  phoneNumber: "0897867564",
};

const buyerPayload = {
  id: 1,
  username: "Arief",
  email: "arief.zhang21@gmail.com",
  address: "Jl. Bandung",
  phoneNumber: "0897867564",
};

let access_token = generateToken(adminPayload);
let access_token1 = generateToken(buyerPayload);

let token_id;

beforeAll((done) => {
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
      return queryInterface.bulkDelete("Admins", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then(() => {
      return queryInterface.bulkDelete("BoughtHistories", null, {
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

describe("Change Status after payment success from user", () => {
  beforeAll((done) => {
    let buyer = [
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

    let dealer = {
      name: "Fida",
      phoneNumber: "0897867564",
      email: "fida@gmail.com",
      password: hashPassword("12345"),
      storeName: "Car-Tique",
      storeAddress: "Jl. Jakarta",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let admin = {
      name: "Fida",
      role: "admin",
      phoneNumber: "0897867564",
      email: "fida@gmail.com",
      password: hashPassword("12345"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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
      status: "sold",
      subscriptionId: "4fcc7e07-264e-480a-8380-c083a5d5e206",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    queryInterface
      .bulkInsert("Buyers", buyer, {})
      .then(() => {
        return Dealer.create(dealer);
      })
      .then(() => {
        return Admin.create(admin);
      })
      .then(() => {
        return Car.create(car);
      })
      .then(() => {
        return queryInterface.bulkInsert(
          "BoughtHistories",
          [
            {
              carName: "Mustang G5",
              description: "This is sport car",
              boughtDate: new Date(),
              paidOff: true,
              price: 1000000000,
              BuyerId: 1,
              orderId: "OTOSIC-0" + 3 + "-" + new Date().getTime() + "-0",
              CarId: 1,
              installment: true,
              currentInstallment: 1,
              totalInstallment: 3,
              saved_token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              carName: "Mustang G5",
              description: "This is sport car",
              boughtDate: new Date(),
              paidOff: true,
              price: 1000000000,
              BuyerId: 1,
              orderId: "OTOSIC-0" + 3 + "-" + new Date().getTime() + "-1",
              CarId: 1,
              installment: true,
              currentInstallment: 2,
              totalInstallment: 3,
              saved_token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              carName: "Mustang G5",
              description: "This is sport car",
              boughtDate: new Date(),
              paidOff: true,
              price: 1000000000,
              BuyerId: 1,
              orderId: "OTOSIC-0" + 3 + "-" + new Date().getTime() + "-2",
              CarId: 1,
              installment: true,
              currentInstallment: 3,
              totalInstallment: 3,
              saved_token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              carName: "Mustang G5",
              description: "This is sport car",
              boughtDate: new Date(),
              paidOff: true,
              price: 1000000000,
              BuyerId: 1,
              orderId: "OTOSIC-0" + 3 + "-" + new Date().getTime() + "-3",
              CarId: 1,
              installment: true,
              currentInstallment: 3,
              totalInstallment: 3,
              saved_token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          {}
        );
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
        return queryInterface.bulkDelete("BoughtHistories", null, {
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

  beforeEach(async () => {
    let resp = await core.cardToken({
      client_key: CLIENT_KEY,
      token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
      card_cvv: "123",
    });

    token_id = resp.token_id;
  });

  describe("PATCH /payments/update/cars- Failed Test Part.2", () => {
    test("If car payment already finished should return an Object with message 'Car installment already finished.", (done) => {
      request(app)
        .post("/payments/credits/cars")
        .set("access_token", access_token1)
        .send({
          token_id,
          CarId: 1,
        })
        .then((res) => {
          expect(res.status).toBe(403);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty(
            "message",
            "Car installment already finished."
          );
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});

describe("Get status payment from buyer by order Id", () => {
  beforeAll((done) => {
    let buyer = [
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
      status: "sold",
      subscriptionId: "4fcc7e07-264e-480a-8380-c083a5d5e206",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    queryInterface
      .bulkInsert("Buyers", buyer, {})
      .then(() => {
        return Dealer.create(dealer);
      })
      .then(() => {
        return Car.create(car);
      })
      .then(() => {
        return queryInterface.bulkInsert(
          "BoughtHistories",
          [
            {
              carName: "Mustang G5",
              description: "This is sport car",
              boughtDate: new Date(),
              paidOff: true,
              price: 1000000000,
              BuyerId: 1,
              orderId: "OTOSIC-0" + 3 + "-" + new Date().getTime() + "-0",
              CarId: 1,
              installment: true,
              currentInstallment: 1,
              totalInstallment: 3,
              saved_token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              carName: "Mustang G5",
              description: "This is sport car",
              boughtDate: new Date(),
              paidOff: true,
              price: 1000000000,
              BuyerId: 1,
              orderId: "OTOSIC-0" + 3 + "-" + new Date().getTime() + "-1",
              CarId: 1,
              installment: true,
              currentInstallment: 2,
              totalInstallment: 3,
              saved_token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              carName: "Mustang G5",
              description: "This is sport car",
              boughtDate: new Date(),
              paidOff: true,
              price: 1000000000,
              BuyerId: 1,
              orderId: "OTOSIC-0" + 3 + "-" + new Date().getTime() + "-2",
              CarId: 1,
              installment: true,
              currentInstallment: 3,
              totalInstallment: 3,
              saved_token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              carName: "Mustang G5",
              description: "This is sport car",
              boughtDate: new Date(),
              paidOff: true,
              price: 1000000000,
              BuyerId: 1,
              orderId: "OTOSIC-0" + 3 + "-" + new Date().getTime() + "-3",
              CarId: 1,
              installment: true,
              currentInstallment: 3,
              totalInstallment: 3,
              saved_token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          {}
        );
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
        return queryInterface.bulkDelete("BoughtHistories", null, {
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

  beforeEach(async () => {
    let resp = await core.cardToken({
      client_key: CLIENT_KEY,
      token_id: "521111bOTBrmSVloNsxMrGjcCUol1117",
      card_cvv: "123",
    });

    token_id = resp.token_id;
  });
  describe("POST /payments/status/midtrans - Success Test", () => {
    test("If status payment was 'settlement' or 'capture' should return an Object instance", (done) => {
      request(app)
        .post("/payments/status/midtrans")
        .set("access_token", access_token)
        .send({
          order_id: "OTOSIC-01-1647857284920-0",
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty("masked_card", expect.any(String));
          expect(res.body).toHaveProperty("approval_code", expect.any(String));
          expect(res.body).toHaveProperty("bank", expect.any(String));
          expect(res.body).toHaveProperty("eci", expect.any(String));
          expect(res.body).toHaveProperty("saved_token_id", expect.any(String));
          expect(res.body).toHaveProperty(
            "saved_token_id_expired_at",
            expect.any(String)
          );
          expect(res.body).toHaveProperty(
            "channel_response_code",
            expect.any(String)
          );
          expect(res.body).toHaveProperty(
            "channel_response_message",
            expect.any(String)
          );
          expect(res.body).toHaveProperty(
            "three_ds_version",
            expect.any(String)
          );
          expect(res.body).toHaveProperty(
            "transaction_time",
            expect.any(String)
          );
          expect(res.body).toHaveProperty("gross_amount", expect.any(String));
          expect(res.body).toHaveProperty("currency", expect.any(String));
          expect(res.body).toHaveProperty("order_id", expect.any(String));
          expect(res.body).toHaveProperty("payment_type", expect.any(String));
          expect(res.body).toHaveProperty("signature_key", expect.any(String));
          expect(res.body).toHaveProperty("status_code", expect.any(String));
          expect(res.body).toHaveProperty("transaction_id", expect.any(String));
          expect(res.body).toHaveProperty(
            "transaction_status",
            expect.any(String)
          );
          expect(res.body).toHaveProperty("fraud_status", expect.any(String));
          expect(res.body).toHaveProperty(
            "settlement_time",
            expect.any(String)
          );
          expect(res.body).toHaveProperty("status_message", expect.any(String));
          expect(res.body).toHaveProperty("merchant_id", expect.any(String));
          expect(res.body).toHaveProperty("card_type", expect.any(String));
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    describe("POST /payments/status/midtrans - Failed Test", () => {
      test("If order Id doesn't exist should return an Object instance", (done) => {
        request(app)
          .post("/payments/status/midtrans")
          .set("access_token", access_token)
          .send({
            order_id: "OTOSIC-01-1647857284920-2",
          })
          .then((res) => {
            expect(res.status).toBe(404);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveProperty(
              "message",
              "Transaction doesn't exist."
            );
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      test("If order Id doesn't exist should return an Object instance", (done) => {
        request(app)
          .post("/payments/status/midtrans")
          .set("access_token", access_token)
          .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveProperty("message", "Order Id is required.");
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
});
