import { cert, initializeApp } from "firebase-admin/app";
import {
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
} from "./env.config";
import logger from "./logger.config";

class Firebase {
  constructor() {
    try {
      initializeApp({
        credential: cert({
          projectId: FIREBASE_PROJECT_ID,
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          clientEmail: FIREBASE_CLIENT_EMAIL,
        }),
      });
      logger.info("Firebase initialized successfully");
    } catch (error) {
      logger.error(`Error initializing Firebase; ${error.message}`);
    }
  }
}

export default new Firebase();
