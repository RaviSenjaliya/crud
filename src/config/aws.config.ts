import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import {
  AWS_COGNITO_CLIENT_ID,
  AWS_COGNITO_REGION,
  AWS_COGNITO_USER_POOL_ID,
} from "./env.config";
import { CognitoJwtVerifier } from "aws-jwt-verify";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_COGNITO_REGION,
});

export const verifier = CognitoJwtVerifier.create({
  userPoolId: AWS_COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: AWS_COGNITO_CLIENT_ID,
});
