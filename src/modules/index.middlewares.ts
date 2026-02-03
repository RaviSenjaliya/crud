import { NextFunction, Request, RequestHandler, Response } from "express";
import rTracer from "cls-rtracer";
import { HEADER } from "../constants/index.constant";
import { initializeTracer } from "../config/logger.config";
import Utility from "./index.utility";
import ForbiddenException from "../exceptions/ForbiddenException";
import {
  ACCESS_DENIED,
  FORBIDDEN_REQUEST,
  INVALID_REQUEST_ERROR,
} from "../constants/errorMessages.constant";
import { verifier } from "../config/aws.config";
import { ADMIN_API_KEY } from "../config/env.config";
import apis from "../validator/apiValidatorMapping";
import { ID } from "../constants/endpoint.constant";
import { ValidatorMap } from "../validator/validator.types";
import ApiValidatorUtilities from "../validator/apiValidator.utilities";
import {
  FieldValidationError,
  Result,
  ValidationError,
  validationResult,
} from "express-validator";
import { BAD_REQUEST } from "../constants/httpCodes.constant";

class IndexMiddlewares {
  setRequestTime(
    request: Request,
    _response: Response,
    next: NextFunction
  ): void {
    request.time = new Date().getTime();
    next();
  }

  setRequestId(
    request: Request<{}, {}, {}>,
    response: Response,
    next: NextFunction
  ): void {
    const requestId: string = request.headers[HEADER.X_REQUEST_ID] as string;

    if (!requestId) {
      request.headers[HEADER.X_REQUEST_ID] = rTracer.id() as string;
    } else {
      initializeTracer(request.headers[HEADER.X_REQUEST_ID] as string);
    }

    response.header(HEADER.X_REQUEST_ID, request.headers[HEADER.X_REQUEST_ID]);

    next();
  }

  async signRequestHeader(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const apiKey: string = request.headers["api-key"] as string;
    try {
      if (apiKey !== ADMIN_API_KEY) {
        throw new ForbiddenException(ACCESS_DENIED, FORBIDDEN_REQUEST);
      } else {
        next();
      }
    } catch (error) {
      return Utility.sendErrorResponse(response, error);
    }
  }

  async authenticate(request: Request, response: Response, next: NextFunction) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new ForbiddenException(ACCESS_DENIED, FORBIDDEN_REQUEST);
      }

      const token = authHeader.split(" ")[1];

      const payload = await verifier.verify(token);

      request.user = {
        sub: payload.sub,
        email: payload.email,
        role: payload["custom:role"],
      };

      next();
    } catch (error) {
      return Utility.sendErrorResponse(response, error);
    }
  }

  authorizeRoles = (...roles: string[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
      if (!request.user || !roles.includes(request.user.role)) {
        return response.status(403).json({ message: "Forbidden" });
      }
      next();
    };
  };

  /*
   *  reports and returns validation response to the client
   */
  reportValidationResult(
    request: Request<{}, {}, {}>,
    response: Response,
    next: NextFunction
  ) {
    const validation: Result<ValidationError> = validationResult(request);

    if (!validation.isEmpty()) {
      const errors: ValidationError[] = validation.array();
      const data = errors.map((error: FieldValidationError) => {
        return {
          type: INVALID_REQUEST_ERROR,
          message: error.msg,
          param: error.path ?? undefined,
        };
      });

      return Utility.sendResponse(response, {
        httpCode: BAD_REQUEST,
        data: {
          errors: data,
        },
      });
    }

    next();
  }

  /*
   *  validate the request body and query params
   *  against the api validator mapping file
   */
  validateAPIRequestComponent(): RequestHandler {
    return async (
      request: Request,
      response: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        // Retrieve method (e.g. POST, GET, PUT, DELETE)
        const method = request.method.toUpperCase();

        // Retrieve baseUrl (e.g. /admins/*)
        const baseUrl = request.baseUrl;

        // Retrieve path (e.g. /, /:id, /path, /:id/path)
        let path = request.path;

        // Extract moduleName from baseUrl (e.g. accounts, connect, visitors etc.)
        const moduleName = Utility.getModuleNameFromUrl(baseUrl);

        let validateField;
        const apiModule = apis[`/${moduleName}`]?.[method];

        if (!apiModule) return next();

        if (path === "/") {
          // Root path
          validateField = apiModule[path];
        } else {
          const pathArray = path?.trim()?.split("/");
          const lastElement = pathArray[pathArray.length - 1];

          // if apiModule is undefined, it means that api endpoint is /:id
          validateField = apiModule[`/${lastElement}`] ?? apiModule[ID];
        }

        if (!validateField) return next();

        const moduleValidators = ApiValidatorUtilities.getModuleValidators(
          moduleName
        ) as ValidatorMap;

        if (!moduleValidators) return next();

        for (const validator of validateField) {
          const validate = moduleValidators[validator];

          if (!validate) continue;

          await validate().run(request);
        }

        return next();
      } catch (error) {
        Utility.sendErrorResponse(response, error);
      }
    };
  }
}

export default new IndexMiddlewares();
