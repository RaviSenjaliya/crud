import {
  GlobalSignOutCommand,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Prisma, Role, User } from "@prisma/client";
import CryptoJS from "crypto-js";
import { Request, Response } from "express";

import { cognitoClient } from "../../config/aws.config";
import {
  ADMIN_API_KEY,
  AWS_COGNITO_CLIENT_ID,
  AWS_COGNITO_CLIENT_SECRET,
  AWS_IV_KEY,
  AWS_SECRET_KEY,
} from "../../config/env.config";
import logger from "../../config/logger.config";
import {
  INVALID_EMAIL_PASSWORD,
  LOGIN_FAILED,
} from "../../constants/errorMessages.constant";
import { CREATED, OK } from "../../constants/httpCodes.constant";
import { USER_PREFIX } from "../../constants/index.constant";
import NotFoundException from "../../exceptions/NotFoundException";
import UnauthorizedException from "../../exceptions/UnauthorizedException";
import Utility from "../index.utility";
import authServices from "./auth.services";
import {
  ICognitoTokens,
  ICreateUserRequestBody,
  ILoginUserRequestBody,
  IRefreshTokenRequestBody,
} from "./auth.types";
import {
  default as AdminUtilities,
  default as AuthUtilities,
} from "./auth.utilities";

class AuthControllers {
  async signUp(
    request: Request<{}, {}, ICreateUserRequestBody>,
    response: Response
  ) {
    try {
      const { first_name, last_name, email, password } = request.body;
      const apiKey = request?.headers["api-key"];
      const userId: string = Utility.generateRandomID(USER_PREFIX);

      let role: Role = Role.USER;
      if (apiKey === ADMIN_API_KEY) {
        role = Role.ADMIN;
      }

      const secretHash = AuthUtilities.generateSecretHash(
        email,
        AWS_COGNITO_CLIENT_ID!,
        AWS_COGNITO_CLIENT_SECRET!
      );

      const command = new SignUpCommand({
        ClientId: AWS_COGNITO_CLIENT_ID!,
        SecretHash: secretHash,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "custom:role", Value: role },
        ],
      });

      const result = await cognitoClient.send(command);

      // Save user in MongoDB
      if (result) {
        const timestamp: number = new Date().getTime();

        const encryptedPassword: string = CryptoJS.AES.encrypt(
          password,
          CryptoJS.enc.Utf8.parse(AWS_SECRET_KEY),
          {
            iv: CryptoJS.enc.Hex.parse(AWS_IV_KEY),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        ).toString();

        const user: Prisma.UserCreateInput = {
          id: userId,
          email,
          firstName: first_name,
          lastName: last_name,
          role: role,
          password: encryptedPassword,
          createdAt: new Date(timestamp),
          updatedAt: new Date(timestamp),
        };

        await authServices.signUp(user);
      }

      Utility.sendResponse(response, {
        httpCode: CREATED,
        data: {},
      });
    } catch (error) {
      logger.error(`Error at signUp with message ${error.message}`);
      if (error.name) {
        const errorDetails = AdminUtilities.cognitoErrorHandler(error);
        return Utility.sendResponse(response, errorDetails);
      }
      return Utility.sendErrorResponse(response, error);
    }
  }

  async signIn(
    request: Request<{}, {}, ILoginUserRequestBody>,
    response: Response
  ) {
    try {
      const { email, password } = request.body;
      const createdUser: User = await authServices.getUser(email);

      if (createdUser) {
        const secretHash = AuthUtilities.generateSecretHash(
          createdUser.email,
          AWS_COGNITO_CLIENT_ID!,
          AWS_COGNITO_CLIENT_SECRET!
        );
        const decryptPassword = CryptoJS.AES.decrypt(
          createdUser.password,
          CryptoJS.enc.Utf8.parse(AWS_SECRET_KEY),
          {
            iv: CryptoJS.enc.Hex.parse(AWS_IV_KEY),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        ).toString(CryptoJS.enc.Utf8);

        if (password === decryptPassword) {
          const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: AWS_COGNITO_CLIENT_ID!,
            AuthParameters: {
              SECRET_HASH: secretHash,
              USERNAME: email,
              PASSWORD: password,
            },
          });

          const result: InitiateAuthCommandOutput =
            await cognitoClient.send(command);

          const hydratedBody: ICognitoTokens =
            AdminUtilities.buildAdminTokenResponseBody(result);

          Utility.sendResponse(response, {
            httpCode: OK,
            data: hydratedBody,
          });
        } else {
          throw new UnauthorizedException(INVALID_EMAIL_PASSWORD, LOGIN_FAILED);
        }
      } else {
        throw new NotFoundException(INVALID_EMAIL_PASSWORD);
      }
    } catch (error) {
      logger.error(`Error at signIn with message ${error.message}`);
      if (error.name) {
        const errorDetails = AdminUtilities.cognitoErrorHandler(error);
        return Utility.sendResponse(response, errorDetails);
      }
      return Utility.sendErrorResponse(response, error);
    }
  }

  async signOut(request: Request<{}, {}, {}>, response: Response) {
    try {
      const accessToken = request.headers.authorization?.split(" ")[1];
      const command = new GlobalSignOutCommand({
        AccessToken: accessToken!,
      });

      await cognitoClient.send(command);

      Utility.sendResponse(response, { httpCode: OK, data: {} });
    } catch (error) {
      logger.error(`Error at signOut with message ${error.message}`);

      return Utility.sendErrorResponse(response, error);
    }
  }

  async getUser(request: Request, response: Response) {
    try {
      const { email } = request.user!;

      const createdUser: User = await authServices.getUser(email);

      const data = AdminUtilities.buildAdminUserResponseBody(createdUser);

      Utility.sendResponse(response, {
        httpCode: OK,
        data,
      });
    } catch (error) {
      logger.error(`Error at getUser with message ${error.message}`);
      return Utility.sendErrorResponse(response, error);
    }
  }

  async generateToken(
    request: Request<{}, {}, IRefreshTokenRequestBody>,
    response: Response
  ) {
    try {
      const { refresh_token: refreshToken } = request.body;

      const command = new InitiateAuthCommand({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID!,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      });

      const result: InitiateAuthCommandOutput =
        await cognitoClient.send(command);

      const hydratedBody: ICognitoTokens =
        AdminUtilities.buildAdminTokenResponseBody(result);

      Utility.sendResponse(response, {
        httpCode: OK,
        data: hydratedBody,
      });
    } catch (error) {
      logger.error(`Error at generateToken with message: ${error.message}`);
      return Utility.sendErrorResponse(response, error);
    }
  }
}

export default new AuthControllers();
