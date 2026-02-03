import { BAD_REQUEST } from "../constants/httpCodes.constant";
import HttpException from "./HttpException";

class BadRequestException extends HttpException {
  constructor(message: string, type: string = "invalid_request_error") {
    super(message, BAD_REQUEST, new Error().stack, type);
  }
}

export default BadRequestException;
