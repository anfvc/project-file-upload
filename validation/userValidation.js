import { body, validationResult } from "express-validator";
import User from "../Model/User.js";

//* set the rules for validation (in an array)

export const validateSignUp = [
    body("email")
        .not().isEmpty().withMessage("email is required")
        .trim()
        .isEmail().withMessage("invalid email format")
        .custom(async (email) => {
            const duplicate = await User.findOne({ email });
            if (duplicate) throw new Error("email already in use");
    }),

    body("password")
        .not().isEmpty().withMessage("password is required")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
    }).withMessage("password requires a minimum of 8 characters including at least 1 symbol, 1 uppercase, 1 lowercase, and 1 number")
];

//* check the rules and get the error result (function)
export const userValidationErrorHandling = (req, res, next) => {
    // get the error result based on the validation rules array
    const errors = validationResult(req);
    console.log(errors)
    if (errors.isEmpty()) return next(); // if no error found, please move on the the sign up handler function

    const err = new Error(
        errors.array()
            .map(err => err.msg)
            .join(", ")
    )
    next(err);
}