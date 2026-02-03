import AuthValidators from "../modules/auth/auth.validators";
import { ApiValidatorModule } from "./validator.types";

class ApiValidatorUtilities {
  static getModuleValidators(module: string): ApiValidatorModule {
    const validatorsMap: Record<string, ApiValidatorModule> = {
      auth: AuthValidators,
    };

    return validatorsMap[module] ?? null;
  }
}

export default ApiValidatorUtilities;
