const userRouter = require("express").Router();
const { signup } = require("../controllers/authController");
const { validateSignup } = require("../validators/validateBody");
const { validate } = require("../validators/validate");

userRouter.route("/").post(validateSignup, validate, signup);

module.exports = userRouter;
