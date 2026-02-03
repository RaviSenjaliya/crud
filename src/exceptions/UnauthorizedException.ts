import { UNAUTHORIZED } from "../constants/httpCodes.constant";
import HttpException from "./HttpException";

class UnauthorizedException extends HttpException {
  constructor(message: string, type: string = "invalid_request_error") {
    super(message, UNAUTHORIZED, new Error().stack, type);
  }
}

export default UnauthorizedException;
