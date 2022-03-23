const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_URL,
  publicKey: process.env.IMAGE_KIT_PUBLIC,
  privateKey: process.env.IMAGE_KIT_PRIVATE,
});

const imagekitAuth = (req, res) => {
  let result = imagekit.getAuthenticationParameters();
  res.send(result);
};

module.exports = {
  imagekitAuth,
};
