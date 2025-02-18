const userRouter = require("express").Router();
const {
  signup,
  login,
  logout,
  protect,
  authenticateUser,
} = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../validators/validateBody");
const { validate } = require("../validators/validate");

userRouter.route("/signup").post(validateSignup, validate, signup);

userRouter.route("/login").post(validateLogin, validate, login);

userRouter.route("/logout").post(protect, logout);

userRouter.route("/me").get(protect, authenticateUser);

// userRouter.route("/try").get(protect, (req, res, next) => {
//   console.log(req.user);
//   next();
// });

module.exports = userRouter;
