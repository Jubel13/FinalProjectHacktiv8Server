const router = require("express").Router();

const {
  payment,
  firstInstallment,
  nextInstallment,
  status,
  updatePayment,
  statusMidtrans
} = require("../controllers/paymentController");

const buyerAuthentication = require("../middlewares/buyerAuth");

router.post("/", buyerAuthentication, payment);
router.get("/status", buyerAuthentication, status);
router.post("/status/midtrans", buyerAuthentication, statusMidtrans);
router.post("/credits/cars", buyerAuthentication, nextInstallment);
router.patch("/update/:id?", buyerAuthentication, updatePayment);
router.post("/credits/:id?", buyerAuthentication, firstInstallment);

module.exports = router;
