const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const {
  createUser,
  getUserByEmail,
  getUserById,
} = require("../models/userModel");
const AppError = require("../utils/appError");

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

exports.logout = (req, res, next) => {
  res.clearCookie("jwt");

  res.status(200).json({
    status: "success",
  });
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      throw new AppError(
        "You are not logged in! Please log in to get access.",
        401
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await getUserById(decoded.id);
    req.user.password = undefined;

    next();
  } catch (error) {
    next(error);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "You do not have permission to perform this action",
        403
      );
    }

    next();
  };
};

exports.authenticateUser = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
};
