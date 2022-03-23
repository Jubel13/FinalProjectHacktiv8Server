const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  urlEndpoint: 'https://ik.imagekit.io/iqpgx3omg7kg/auto-classic',
  publicKey: 'public_BACW09RMefisOpJUrHcxl/9Id9g=',
  privateKey: 'private_m8l+5XTYExKEbUee/bgFrxEd59E='
});

const imagekitAuth = (req, res) => {
  let result = imagekit.getAuthenticationParameters();
  res.send(result);
}

module.exports = {
  imagekitAuth
}