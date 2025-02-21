const excurtionRouter = require("express").Router();
const { createExcursion, getAllExcursions } = require("../controllers/excurtionController");

excurtionRouter.route("/").post(createExcursion).get(getAllExcursions);

module.exports = excurtionRouter;
