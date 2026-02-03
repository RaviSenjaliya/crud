import { body } from "express-validator";
import Utility from "../index.utility";
import {
  FIELD_BLANK,
  INVALID_PARAMETER,
  INVALID_PASSWORD_MSG,
} from "../../constants/errorMessages.constant";

class AuthValidators {
  static readonly signupValidators = [
    "validateEmail",
    "validateFirstName",
    "validateLastName",
    "validatePassword",
  ];

  static readonly loginValidators = ["validateEmail", "validateEmptyPassword"];

  static readonly RefreshTokenValidators = ["validateRefreshToken"];

  static validateEmail() {
    return body("email")
      .notEmpty()
      .withMessage(Utility.replaceStringFields(FIELD_BLANK, { field: "email" }))
      .isEmail()
      .withMessage(
        Utility.replaceStringFields(INVALID_PARAMETER, {
          field1: "email",
          field2: "email",
        })
      );
  }

  static validatePassword() {
    return body("password")
      .notEmpty()
      .withMessage(
        Utility.replaceStringFields(FIELD_BLANK, { field: "password" })
      )
      .isLength({ min: 8, max: 16 })
      .withMessage(INVALID_PASSWORD_MSG)
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(INVALID_PASSWORD_MSG);
  }

  static validateEmptyPassword() {
    return body("password")
      .notEmpty()
      .withMessage(
        Utility.replaceStringFields(FIELD_BLANK, { field: "password" })
      );
  }

  static validateFirstName() {
    return body("first_name")
      .notEmpty()
      .withMessage(
        Utility.replaceStringFields(FIELD_BLANK, {
          field: "first_name",
        })
      )
      .isAlpha()
      .withMessage(
        Utility.replaceStringFields(INVALID_PARAMETER, {
          field1: "first_name",
          field2: "first_name",
        })
      );
  }

  static validateLastName() {
    return body("last_name")
      .notEmpty()
      .withMessage(
        Utility.replaceStringFields(FIELD_BLANK, {
          field: "last_name",
        })
      )
      .isAlpha()
      .withMessage(
        Utility.replaceStringFields(INVALID_PARAMETER, {
          field1: "last_name",
          field2: "last_name",
        })
      );
  }

  static validateRefreshToken() {
    return body("refresh_token")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage(
        Utility.replaceStringFields(FIELD_BLANK, {
          field: "refresh_token",
        })
      )
      .bail()
      .isString()
      .withMessage(
        Utility.replaceStringFields(INVALID_PARAMETER, {
          field1: "refresh_token",
          field2: "refresh_token",
        })
      );
  }
}

export default AuthValidators;
