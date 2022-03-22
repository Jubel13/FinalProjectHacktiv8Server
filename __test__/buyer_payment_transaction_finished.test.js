const app = require("../app");
const request = require("supertest");
const { BoughtHistory, Car, Dealer, sequelize } = require("../models");
const { queryInterface } = sequelize;
const { generateToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const core = require("../API/core_MidtransAPI");
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
  };
});

const buyerPayload = {
  id: 1,
  username: "Arief",
  email: "arief.zhang21@gmail.com",
  address: "Jl. Bandung",
  phoneNumber: "0897867564",
};

let access_token = generateToken(buyerPayload);

let token_id;

beforeAll((done) => {
  //! mocking jest HIT ke midtrans
  //! create Buyer, Dealer
  //! create Type, Brand, Car
  //! create BoughtHistory

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

describe("PATCH ", () => {
  test("test", (done) => {
    request(app)
      .post("/payments/credits/cars")
      .set("access_token", access_token)
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
