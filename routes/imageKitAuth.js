const router = require("express").Router();
const { imagekitAuth } = require("../controllers/imagekitAuthController")

router.get("/", imagekitAuth)

module.exports = router