const express = require("express");
const router = express.Router();
const {
  changeInspection,
  getInspections,
  getInspection,
} = require("../controllers/inspectionController");

const adminAuthentication = require("../middlewares/adminAuth");

const {
  changeExteriorInspection,
  getExterior,
} = require("../controllers/exteriorController");

const {
  changeInteriorInspection,
  getInterior,
} = require("../controllers/interiorController");

const {
  getKolong,
  changeKolongInsp,
} = require("../controllers/kolongController");
const {
  getRoadTest,
  changeRoadTestInsp,
} = require("../controllers/roadtestController");

router.get("/", getInspections);
router.get("/:id", getInspection);

router.patch("/:id", adminAuthentication, changeInspection);

router.patch(
  "/exterior-detail/:id",
  adminAuthentication,
  changeExteriorInspection
);
router.get("/exterior-detail/:id", getExterior);

router.patch(
  "/interior-detail/:id",
  adminAuthentication,
  changeInteriorInspection
);
router.get("/interior-detail/:id", getInterior);

router.get("/kolong-detail/:id", getKolong);
router.patch("/kolong-detail/:id", adminAuthentication, changeKolongInsp);

router.get("/roadtest-detail/:id", getRoadTest);
router.patch("/roadtest-detail/:id", adminAuthentication, changeRoadTestInsp);

module.exports = router;
