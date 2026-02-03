import { Role } from "@prisma/client";
import { IndexedObject } from "../index.type";

export interface ICreateUserRequestBody {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role?: Role;
}

export interface ILoginUserRequestBody {
  email: string;
  password: string;
}

export interface IRefreshTokenRequestBody {
  refresh_token: string;
}

export interface IMapUser extends IndexedObject {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created: bigint | number;
  modified: bigint | number;
}

export interface ITokens {
  email: string;
}

export interface ICognitoError {
  name: string;
  message: string;
  stack?: string;
  code: string;
}

export interface ICognitoTokens {
  access_token: string;
  id_token: string;
  refresh_token: string;
}

export interface IResponseTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}
