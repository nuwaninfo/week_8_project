import { body, ValidationChain } from "express-validator"

const loginValdations: ValidationChain[] = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email")
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password not found")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
    .withMessage(
      `Please enter stong password.
           Password leangth should be minmum 8. 
           Should have minimum 1 lowercase characters. 
           Should have minimum 1 uppercase character. 
           Should have minimum 1 numbers. 
           Should have minimum 1 symbols`
    )
    .escape(),
]

const registerValdations: ValidationChain[] = [
  ...loginValdations,
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Please enter username")
    .isLength({ min: 3, max: 25 })
    .withMessage("username should be min 3 characters and max 25 characters")
    .escape(),
]

export { registerValdations, loginValdations }
