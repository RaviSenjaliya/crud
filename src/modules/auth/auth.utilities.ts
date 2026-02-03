import { InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import { User } from "@prisma/client";
import {
  INTERNAL_SERVER_ERROR_MSG,
  INVALID_EMAIL_PASSWORD,
  INVALID_REQUEST_ERROR,
  MISSING_COGNITO_IAM_CREDENTIALS,
  NOT_AUTHORIZED,
  USER_NAME_EXISTS,
  USER_NOT_CONFIRMED,
  USER_NOT_CONFIRMED_MSG,
  USERNAME_ALREADY_EXIST,
} from "../../constants/errorMessages.constant";
import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE,
  UNAUTHORIZED,
} from "../../constants/httpCodes.constant";
import { ICognitoError, ICognitoTokens, IMapUser } from "./auth.types";

class AuthUtilities {
  static generateSecretHash(
    username: string,
    clientId: string,
    clientSecret: string
  ): string {
    return crypto
      .createHmac("sha256", clientSecret)
      .update(username + clientId)
      .digest("base64");
  }

  static buildAdminUserResponseBody(user: User): IMapUser {
    return {
      id: user?.id,
      email: user?.email,
      first_name: user?.firstName,
      last_name: user?.lastName,
      created: Number(user?.createdAt),
      modified: Number(user?.updatedAt),
    };
  }

  static buildAdminTokenResponseBody(
    tokens: InitiateAuthCommandOutput
  ): ICognitoTokens {
    return {
      access_token: tokens?.AuthenticationResult?.AccessToken,
      id_token: tokens?.AuthenticationResult?.IdToken,
      refresh_token: tokens?.AuthenticationResult?.RefreshToken,
    };
  }

  static cognitoErrorHandler(error: ICognitoError) {
    console.log(error);

    switch (error?.name) {
      case USER_NAME_EXISTS: {
        return {
          httpCode: BAD_REQUEST,
          data: {
            errors: [
              {
                type: INVALID_REQUEST_ERROR,
                message: USERNAME_ALREADY_EXIST,
              },
            ],
          },
        };
      }

      case NOT_AUTHORIZED: {
        return {
          httpCode: UNAUTHORIZED,
          data: {
            errors: [
              {
                type: INVALID_REQUEST_ERROR,
                message: INVALID_EMAIL_PASSWORD,
              },
            ],
          },
        };
      }

      case USER_NOT_CONFIRMED: {
        return {
          httpCode: FORBIDDEN,
          data: {
            errors: [
              {
                type: INVALID_REQUEST_ERROR,
                message: USER_NOT_CONFIRMED_MSG,
              },
            ],
          },
        };
      }

      case MISSING_COGNITO_IAM_CREDENTIALS: {
        return {
          httpCode: SERVICE_UNAVAILABLE,
          data: {
            errors: [
              {
                type: INVALID_REQUEST_ERROR,
                message: MISSING_COGNITO_IAM_CREDENTIALS,
              },
            ],
          },
        };
      }

      default: {
        return {
          httpCode: INTERNAL_SERVER_ERROR,
          data: {
            errors: [
              {
                type: INVALID_REQUEST_ERROR,
                message: INTERNAL_SERVER_ERROR_MSG,
              },
            ],
          },
        };
      }
    }
  }
}

export default AuthUtilities;
