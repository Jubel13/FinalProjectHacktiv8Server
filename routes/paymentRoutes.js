const router = require("express").Router();

const {
  payment,
  firstInstallment,
  nextInstallment,
  status,
  updatePayment,
} = require("../controllers/paymentController");

const buyerAuthentication = require("../middlewares/buyerAuth");

router.post("/", buyerAuthentication, payment);
router.get("/status", buyerAuthentication, status);
router.patch("/update/:id?", buyerAuthentication, updatePayment);
router.post("/credits/cars", buyerAuthentication, nextInstallment);
router.post("/credits/:id?", buyerAuthentication, firstInstallment);

module.exports = router;
