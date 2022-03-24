const app = require("../app");
const request = require("supertest");
const ImageKit = require("imagekit");
const { imagekitAuth } = require("../controllers/imagekitAuthController");
var httpMocks = require("node-mocks-http");

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_URL,
  publicKey: process.env.IMAGE_KIT_PUBLIC,
  privateKey: process.env.IMAGE_KIT_PRIVATE,
});

describe("Image kit auth", () => {
  test("should return response when image auth called", async () => {
    let result = imagekit.getAuthenticationParameters();
    const response = httpMocks.createResponse();

    imagekitAuth(request, response, (err) => {
      expect(err).toBeFalsy();
    });

    const data = response._getData();

    expect(data).toBeInstanceOf(Object);
  });
});
