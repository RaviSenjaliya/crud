import { Response } from "express";
import {
  FieldTypes,
  IError,
  IResponseBuilderData,
  ResponseError,
} from "./index.type";
import HttpException from "../exceptions/HttpException";
import { INTERNAL_SERVER_ERROR } from "../constants/httpCodes.constant";
import { INTERNAL_SERVER_ERROR_MSG } from "../constants/errorMessages.constant";
import { CHAR_SET, RANDOM_ID_STRING_LENGTH } from "../constants/index.constant";

class Utility {
  /*
   *  @param response [Response] response object from the API
   *  @param metadata [IResponseBuilderData] object containing data metadata to be included in the response
   *  @description set the status code and write the response data in JSON
   */
  static sendResponse(response: Response, metadata: IResponseBuilderData) {
    return response.status(metadata.httpCode).json(metadata.data);
  }

  /*
   *  @param response [Response] response object from the API
   *  @param error [Error] error object received in the catch block
   *  @description set the error status code and write the response data in JSON
   */
  static sendErrorResponse(response: Response, error: Error) {
    let message: string = null,
      type: string = null,
      httpCode: number = null;

    if (error instanceof HttpException) {
      httpCode = error.statusCode;
      type = error.type;
      message = error.message;
    } else {
      const errorFinal: ResponseError = this.propagateAPIErrors(error);
      httpCode = errorFinal.status;
      type = errorFinal.type;
      message = errorFinal.message;
    }

    return this.sendResponse(response, {
      httpCode,
      data: {
        errors: [
          {
            type,
            message,
          },
        ],
      },
    });
  }

  /*
   *  @param error [IError] error object from the catch block
   *  @description check the error object and propagate internal API errors, if any
   */
  static propagateAPIErrors(error: IError): ResponseError {
    const responseError: ResponseError = {
      type: "internal_server_error",
      message: INTERNAL_SERVER_ERROR_MSG,
      stack: error?.stack,
      status: INTERNAL_SERVER_ERROR,
    };

    if (error?.response?.data) {
      const errors = error.response.data.errors || [];
      const errorFinal = errors[0] || error;

      responseError.type = errorFinal.type || "internal_server_error";
      responseError.message = errorFinal.message;
      responseError.status = error.response.status || INTERNAL_SERVER_ERROR;
    }

    return responseError;
  }

  /*
   *  @param string [string] string whose contents will be replaced
   *  @param replacer [object] object containing the fields in the string to be replaced
   *  @description replace the fields in the given string with the replacers
   */
  static replaceStringFields(
    string: string,
    replacer: Record<string, string>
  ): string {
    const replacerKeys = Object.keys(replacer);
    let newString = string;

    for (const key of replacerKeys) {
      newString = newString.replace(`{{${key}}}`, replacer[key]);
    }

    return newString;
  }

  /*
   *  @param field [FieldTypes] field to be checked for emptiness
   *  @param withoutZero [boolean] whether to check falseness of zero (0) or not i.e. if false, zero will be falsy, otherwise, zero will not be falsy
   *  @description check if the given field is empty
   */
  static isEmpty(field: FieldTypes, withoutZero?: boolean): boolean {
    if (!field) {
      // apply check on withoutZero flag only if field is zero
      if (field === 0) {
        return !withoutZero;
      }

      return true;
    }

    if (field instanceof Array) {
      if (!field.length) {
        return true;
      }
    }

    if (field instanceof Object) {
      const keys = Object.keys(field);

      if (!keys.length) {
        return true;
      }
    }

    return false;
  }

  /*
   *  @param prefix [string] a word to be prefixed that represents an entity (e.g. plink, prod, etc.)
   *  @param length [number] optional length of the generate ID
   *  @description Generate a random ID based on the UNIX timestamp and randomized characters
   */
  static generateRandomID(
    prefix?: string,
    length?: number,
    addMs?: number
  ): string {
    let id: string;
    let idLength: number;
    let timestamp = Date.now();
    // If addMs provided add it in timestamp
    if (addMs) {
      timestamp += addMs;
    }
    const timestampString = timestamp.toString(36);
    id = timestampString;
    // if length is given, calculate the remaining length of characters
    // to be appended to the ID
    idLength = length ? length - id.length : RANDOM_ID_STRING_LENGTH;

    for (let i = 0; i < idLength; ++i) {
      const randomPosition = Math.round(Math.random() * CHAR_SET.length);
      id += CHAR_SET.charAt(randomPosition);
    }

    return prefix ? `${prefix}_${id}` : id;
  }

  /*
   *  @param word [string] word to be capitalized
   *  @description capitalize the given word (word -> Word)
   */
  static capitalize(word: string): string {
    if (this.isEmpty(word)) {
      return null;
    }

    const normalized = word.toLowerCase();
    const capitalizedFirstLetter: string = normalized[0].toUpperCase();
    const restString: string = normalized.substring(1);
    return `${capitalizedFirstLetter}${restString}`;
  }

  static getModuleNameFromUrl(baseUrl: string): string {
    if (this.isEmpty(baseUrl)) {
      return null;
    }

    /* splitting the base URL to extract the URL components,
     extracting the last URL component assuming it's the module path,
     fetch the module name from modulepath 
     */

    const splitModuleName: string[] = baseUrl.split("/").pop().split("-");
    // capitalize every word (except the first one)
    const moduleName = splitModuleName.map((word: string, index: number) => {
      // if index is 0 then we know it's the first word
      // and return the word as it is
      if (index === 0) {
        return word;
      }

      // capitalize rest of the words and return them
      return this.capitalize(word);
    });

    // join the array into string without any delimiter
    return moduleName.join("");
  }
}

export default Utility;
