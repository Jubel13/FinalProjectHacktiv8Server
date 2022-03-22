const { RoadTest } = require("../models");

const getRoadTests = async (req, res, next) => {
  try {
    const roadTests = await RoadTest.findAll();
    res.status(200).json(roadTests);
  } catch (err) {
    next(err);
  }
};

const getRoadTest = async (req, res, next) => {
  try {
    const inspectionId = req.params.id;

    const roadTest = await RoadTest.findOne({
      where: { InspectionId: inspectionId },
    });

    if (!roadTest) {
      throw {
        code: 404,
        name: "NOT_FOUND",
        message: "Road inspection not found",
      };
    }

    res.status(200).json(roadTest);
  } catch (err) {
    next(err);
  }
};

const changeRoadTestInsp = async (req, res, next) => {
  try {
    const { name } = req.loginAdmin;

    const {
      engineStarting,
      engineIdling,
      steeringSystem,
      acceleration,
      engineSound,
      brake,
    } = req.body;

    const inspectionId = req.params.id;

    const roadTest = await RoadTest.findOne({
      where: { InspectionId: inspectionId },
    });

    if (!roadTest) {
      throw {
        code: 404,
        name: "NOT_FOUND",
        message: "Road inspection not found",
      };
    }

    await RoadTest.update(
      {
        engineStarting,
        engineIdling,
        steeringSystem,
        acceleration,
        engineSound,
        brake,
        inspectedBy: name,
      },
      {
        where: { InspectionId: inspectionId },
      }
    );

    res.status(200).json({ message: "Road test inspection updated" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRoadTest, changeRoadTestInsp, getRoadTests };
