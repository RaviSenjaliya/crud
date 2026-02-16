import dotenv from "dotenv";

dotenv.config();

// auth
export const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";

// server
export const PORT = process.env.PORT || 4000;

// db
export const DATABASE_URL = process.env.DATABASE_URL || "";

// redis
export const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || "";
export const UPSTASH_REDIS_REST_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || "";

// firebase
export const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || "";
export const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || "";
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "";

// aws
export const AWS_COGNITO_USER_POOL_ID =
  process.env.AWS_COGNITO_USER_POOL_ID || "";
export const AWS_COGNITO_CLIENT_ID = process.env.AWS_COGNITO_CLIENT_ID || "";
export const AWS_COGNITO_CLIENT_SECRET =
  process.env.AWS_COGNITO_CLIENT_SECRET || "";
export const AWS_COGNITO_REGION = process.env.AWS_COGNITO_REGION || "";
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || "";
export const AWS_IV_KEY = process.env.AWS_IV_KEY || "";

// ld
export const LAUNCH_DARKLY_SDK_KEY = process.env.LAUNCH_DARKLY_SDK_KEY || "";
export const LAUNCH_DARKLY_ENABLE = process.env.LAUNCH_DARKLY_ENABLE || "true";
