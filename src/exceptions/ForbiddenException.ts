import { FORBIDDEN } from "../constants/httpCodes.constant";
import HttpException from "./HttpException";

class ForbiddenException extends HttpException {
  constructor(message: string, type?: string) {
    super(message, FORBIDDEN, new Error().stack, type);
  }
}
export default ForbiddenException;
