const excurtionRouter = require("express").Router();
const { createExcursion } = require("../controllers/excurtionController");

excurtionRouter.route("/").post(createExcursion);

module.exports = excurtionRouter;
