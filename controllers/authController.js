const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { createUser, getUserByEmail } = require("../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendCookie = (res, token) => {
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashPassword = await argon2.hash(password);
    const role = "user";

    const newUser = await createUser({ email, password: hashPassword, role });
    const token = signToken(newUser.id);
    sendCookie(res, token);

    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      throw new AppError("Incorrect email or password", 401);
    }

    const isPasswordCorrect = await argon2.verify(user.password, password);

    if (!isPasswordCorrect) {
      throw new AppError("Incorrect email or password", 401);
    }

    const token = signToken(user.id);
    sendCookie(res, token);

    user.password = undefined;

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
