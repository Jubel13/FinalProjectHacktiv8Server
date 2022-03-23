const express = require("express");
const router = express.Router();
const dealerRoutes = require("./dealerRoutes");
const paymentRoutes = require("./paymentRoutes");
const carRoutes = require("./carRoutes");
const adminRoutes = require("./adminRoutes");
const inspectionRoutes = require("./inspectionRoutes");
const brandRoutes = require("./brandRoutes");
const typeRoutes = require("./typeRoutes");
const buyerRoutes = require("./buyerRoutes");
const imageKitAuth = require("./imageKitAuth")

router.use("/cars", carRoutes);
router.use("/admins", adminRoutes);
router.use("/inspections", inspectionRoutes);
router.use("/brands", brandRoutes);
router.use("/types", typeRoutes);
router.use("/dealers", dealerRoutes);
router.use("/payments", paymentRoutes);
router.use("/buyers", buyerRoutes);
router.use("/auth", imageKitAuth)

module.exports = router;
