const {
  Inspection,
  Exterior,
  Interior,
  RoadTest,
  Kolong,
} = require("../models");

const getInspections = async (req, res, next) => {
  try {
    const inspections = await Inspection.findAll({
      include: [
        {
          model: Exterior,
        },
        { model: Interior },
        { model: RoadTest },
        { model: Kolong },
      ],
    });
    res.status(200).json(inspections);
  } catch (err) {
    next(err);
  }
};

const getInspection = async (req, res, next) => {
  try {
    const id = req.params.id;
    const inspection = await Inspection.findByPk(id, {
      include: [
        {
          model: Exterior,
        },
        { model: Interior },
        { model: RoadTest },
        { model: Kolong },
      ],
    });

    if (!inspection) {
      throw {
        code: 404,
        name: "NOT_FOUND",
        message: "Inspection not found",
      };
    }

    res.status(200).json(inspection);
  } catch (err) {
    next(err);
  }
};

const changeInspection = async (req, res, next) => {
  try {
    const {
      mainInspection,
      exteriorInspection,
      interiorInspection,
      roadTest,
      kolongTest,
    } = req.body;
    const inspectionId = req.params.id;
    const { name } = req.loginAdmin;

    const inspection = await Inspection.findByPk(inspectionId);
    if (!inspection) {
      throw {
        code: 404,
        name: "NOT_FOUND",
        message: "Inspection not found",
      };
    }

    await Inspection.update(
      {
        mainInspection,
        exteriorInspection,
        interiorInspection,
        roadTest,
        kolongTest,
        inspectedBy: name,
      },
      { where: { id: inspectionId } }
    );

    res.status(200).json({ message: "Inspection updated" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  changeInspection,
  getInspections,
  getInspection,
};
