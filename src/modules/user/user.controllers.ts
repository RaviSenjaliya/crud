import { Request, Response } from "express";
import logger from "../../config/logger.config";
import Utility from "../index.utility";
import UserUtilities from "./user.utilities";
import { OK } from "../../constants/httpCodes.constant";

class UserControllers {
  async createUser(req: Request, res: Response) {
    try {
      const data = await UserUtilities.createUser(req);
      Utility.sendResponse(res, { httpCode: OK, data });
    } catch (error: any) {
      logger.error(`Error at createUser with message ${error.message}`);
      Utility.sendErrorResponse(res, error);
    }
  }
}

export default new UserControllers();
