const { Interior } = require("../models");

const getInteriors = async (req, res, next) => {
  try {
    const interiors = await Interior.findAll();
    res.status(200).json(interiors);
  } catch (err) {
    next(err);
  }
};

const getInterior = async (req, res, next) => {
  try {
    const inspectionId = req.params.id;
    const interior = await Interior.findOne({
      where: { InspectionId: inspectionId },
    });

    if (!interior) {
      throw {
        code: 404,
        name: "NOT_FOUND",
        message: "Interior inspection not found",
      };
    }

    res.status(200).json(interior);
  } catch (err) {
    next(err);
  }
};

const changeInteriorInspection = async (req, res, next) => {
  try {
    const {
      speedometer,
      klakson,
      steeringWheel,
      rearViewMirror,
      dashboard,
      seats,
      gasPedal,
      brakePedal,
    } = req.body;
    const { name } = req.loginAdmin;

    const inspectionId = req.params.id;
    const interior = await Interior.findOne({
      where: { InspectionId: inspectionId },
    });

    if (!interior) {
      throw {
        code: 404,
        name: "NOT_FOUND",
        message: "Interior inspection not found",
      };
    }

    await Interior.update(
      {
        speedometer,
        klakson,
        steeringWheel,
        rearViewMirror,
        dashboard,
        seats,
        gasPedal,
        brakePedal,
        inspectedBy: name,
      },
      {
        where: { InspectionId: inspectionId },
      }
    );

    res.status(200).json({ message: "Interior Inspection updated" });
  } catch (err) {
    next(err);
  }
};

module.exports = { changeInteriorInspection, getInterior, getInteriors };
