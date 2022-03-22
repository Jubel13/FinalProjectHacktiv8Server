const { Kolong } = require("../models");

const getKolongs = async (req, res, next) => {
  try {
    const kolongs = await Kolong.findAll();
    res.status(200).json(kolongs);
  } catch (err) {
    next(err);
  }
};

const getKolong = async (req, res, next) => {
  try {
    const inspectionId = req.params.id;

    const kolong = await Kolong.findOne({
      where: {
        InspectionId: inspectionId,
      },
    });
    if (!kolong) {
      throw {
        code: 404,
        name: "NOT_FOUND",
        message: "Kolong inspection not found",
      };
    }

    res.status(200).json(kolong);
  } catch (err) {
    next(err);
  }
};

const changeKolongInsp = async (req, res, next) => {
  try {
    const {
      oliMesin,
      transmission,
      minyakRem,
      radiator,
      aki,
      bottomCover,
      knalpot,
      kestabilanBan,
      shockBreaker,
      masterBrake,
    } = req.body;

    const { name } = req.loginAdmin;

    const inspectionId = req.params.id;

    const kolong = await Kolong.findOne({
      where: {
        InspectionId: inspectionId,
      },
    });

    if (!kolong) {
      throw {
        code: 404,
        name: "NOT_FOUND",
        message: "Kolong inspection not found",
      };
    }

    await Kolong.update(
      {
        oliMesin,
        transmission,
        minyakRem,
        radiator,
        aki,
        bottomCover,
        knalpot,
        kestabilanBan,
        shockBreaker,
        masterBrake,
        inspectedBy: name,
      },
      {
        where: {
          InspectionId: inspectionId,
        },
      }
    );

    res.status(200).json({ message: "Kolong inspection updated" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getKolong, changeKolongInsp, getKolongs };
