import { NOT_FOUND } from "../constants/httpCodes.constant";
import HttpException from "./HttpException";

class NotFoundException extends HttpException {
  constructor(message: string, type: string = "invalid_request_error") {
    super(message, NOT_FOUND, new Error().stack, type);
  }
}

export default NotFoundException;
