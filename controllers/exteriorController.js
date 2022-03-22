const { Exterior } = require("../models");

const getExteriors = async (req, res, next) => {
  try {
    const exteriors = await Exterior.findAll();
    res.status(200).json(exteriors);
  } catch (err) {
    next(err);
  }
};

const getExterior = async (req, res, next) => {
  try {
    const inspectionId = req.params.id;

    const exterior = await Exterior.findOne({
      where: {
        InspectionId: inspectionId,
      },
    });

    if (!exterior) {
      throw {
        code: 404,
        name: "NOT_FOUND",
        message: "Exterior inspection not found",
      };
    }

    res.status(200).json(exterior);
  } catch (err) {
    next(err);
  }
};

const changeExteriorInspection = async (req, res, next) => {
  try {
    const {
      chassis,
      bumper,
      lights,
      roof,
      spion,
      windShield,
      kacaSamping,
      kacaBelakang,
      tire,
    } = req.body;
    const { name } = req.loginAdmin;

    const inspectionId = req.params.id;

    const exterior = await Exterior.findOne({
      where: {
        InspectionId: inspectionId,
      },
    });

    if (!exterior) {
      throw {
        code: 404,
        name: "NOT_FOUND",
        message: "Exterior inspection not found",
      };
    }

    await Exterior.update(
      {
        chassis,
        bumper,
        lights,
        roof,
        spion,
        windShield,
        kacaSamping,
        kacaBelakang,
        tire,
        inspectedBy: name,
      },
      {
        where: {
          InspectionId: inspectionId,
        },
      }
    );

    res.status(200).json({ message: "exterior Inspection updated" });
  } catch (err) {
    next(err);
  }
};

module.exports = { changeExteriorInspection, getExterior, getExteriors };
