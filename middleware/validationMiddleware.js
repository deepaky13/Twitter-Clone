import { body, validationResult } from "express-validator";
import { BadRequestError } from "../error/customError.js";
import User from "../models/usermodel.js";

const validationError = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        //    return res.status(400).json({ errors: errors });
        const errorMessage = errors.array().map((err) => err.msg);

        throw new BadRequestError(errorMessage);
      }
      next();
    },
  ];
};

export const validateSignUp = validationError([
  body("userName")
    .notEmpty()
    .withMessage("please enter userName")
    .custom(async (userName) => {
      const username = await User.findOne({ userName });
      if (username) {
        throw new BadRequestError("username already exists");
      }
    }),
  body("fullName").notEmpty().withMessage("please enter full name"),
  body("password")
    .notEmpty()
    .withMessage("please enter password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  body("email")
    .notEmpty()
    .withMessage("please enter email address")
    .isEmail()
    .withMessage("please enter valid email")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exists");
      }
    }),
]);
