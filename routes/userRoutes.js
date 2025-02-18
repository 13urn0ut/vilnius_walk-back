const userRouter = require("express").Router();
const { signup, login } = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../validators/validateBody");
const { validate } = require("../validators/validate");

userRouter.route("/signup").post(validateSignup, validate, signup);

userRouter.route("/login").post(validateLogin, validate, login);

module.exports = userRouter;
