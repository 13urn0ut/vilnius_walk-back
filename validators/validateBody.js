const { body, checkExact } = require("express-validator");
const { getUserByEmail } = require("../models/userModel");

exports.validateSignup = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom(async (value) => {
      try {
        const user = await getUserByEmail(value);

        if (user) {
          throw new Error("Email already in use");
        }

        return true;
      } catch (error) {
        throw error;
      }
    }),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirmPassword").custom(async (value, { req }) => {
    try {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    } catch (error) {
      throw error;
    }
  }),

  checkExact([], {
    message: (fields) =>
      `Invalid fields: ${fields.map((field) => field.path).join(", ")}`,
  }),
];

exports.validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  checkExact([], {
    message: (fields) =>
      `Invalid fields: ${fields.map((field) => field.path).join(", ")}`,
  }),
];
