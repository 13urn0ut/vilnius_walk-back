const { createExcursion, getAllExcursions } = require("../models/excursionModel");
const AppError = require("../utils/appError");

exports.createExcursion = async (req, res, next) => {
  try {
    const newExcursion = await createExcursion(req.body);

    if (!newExcursion) {
      throw new AppError("Creation failed", 500);
    }

    res.status(201).json({
      status: "success",
      data: newExcursion,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllExcursions = async (req, res, next) => {
  try {
    const excursions = await getAllExcursions();

    
    

    res.status(200).json({
      status: "success",
      data: excursions,
    });
  } catch (error) {
    next(error);
  }
};
