import { Request } from "express";
import AuthValidators from "../modules/auth/auth.validators";

export type ValidatorMap = Record<
  string,
  () => { run: (request: Request) => Promise<void> }
>;

export type ApiValidatorModule = AuthValidators;
