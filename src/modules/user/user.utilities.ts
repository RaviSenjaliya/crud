import { Request } from "express";
import userServices from "./user.services";
import BadRequestException from "../../exceptions/BadRequestException";
import { checkLDFlag, getLDFlagValue } from "../../config/ld.config";
import { LDContext } from "@launchdarkly/node-server-sdk";

class UserUtilities {
  static async createUser(req: Request): Promise<any> {
    const { body, headers } = req;
    const role = headers["x-user-role"];

    if (!role) {
      throw new BadRequestException("Role header missing");
    }

    // LaunchDarkly user context
    const user: LDContext = {
      kind: "user",
      key: "api-user",
      role: role as string,
    };
    await checkLDFlag("admin-user-api", user);

    return await userServices.createUser(body.name);
  }
}

export default UserUtilities;
