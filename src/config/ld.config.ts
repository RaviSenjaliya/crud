import * as ld from "@launchdarkly/node-server-sdk";
import { UNAUTHORIZED_MESSAGE } from "../constants/errorMessages.constant";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import { LAUNCH_DARKLY_ENABLE, LAUNCH_DARKLY_SDK_KEY } from "./env.config";
import logger from "./logger.config";

let client: ld.LDClient | null = null;

export const initLaunchDarkly = async (): Promise<void> => {
  try {
    if (LAUNCH_DARKLY_ENABLE === "true") {
      client = ld.init(LAUNCH_DARKLY_SDK_KEY);
      await client.waitForInitialization();
      logger.info("LaunchDarkly initialized");
    }
  } catch (error: any) {
    logger.error(`Error initiating LaunchDarkly: ${error.message}`);
  }
};

export const getLDFlagValue = async (
  flagKey: string,
  user: ld.LDContext
): Promise<boolean> => {
  try {
    if (LAUNCH_DARKLY_ENABLE === "true" && client) {
      return await client.variation(flagKey, user, false);
    }
    return true;
  } catch (error: any) {
    logger.error("LD flag error", error);
    return true;
  }
};

export const checkLDFlag = async (ldFlag: string, user: any) => {
  const featureEnable = await getLDFlagValue(ldFlag, user);

  if (!featureEnable) {
    const message = {
      role: user.role,
      message: "Flag is disabled.",
      "ld-flag": ldFlag,
    };
    logger.error(message);
    throw new UnauthorizedException(UNAUTHORIZED_MESSAGE);
  }
};
