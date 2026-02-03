import { Router } from "express";

import {
  GENERATE_TOKENS,
  LOGIN,
  LOGOUT,
  SIGNUP,
  USER,
} from "../../constants/endpoint.constant";
import IndexMiddlewares from "../index.middlewares";
import authControllers from "./auth.controllers";

class AuthRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes(): void {
    const validationMiddleWare = [IndexMiddlewares.authenticate];

    this.router.post(SIGNUP, authControllers.signUp);
    this.router.post(LOGIN, authControllers.signIn);
    this.router.post(LOGOUT, validationMiddleWare, authControllers.signOut);
    this.router.get(USER, validationMiddleWare, authControllers.getUser);
    this.router.post(
      GENERATE_TOKENS,
      validationMiddleWare,
      authControllers.generateToken
    );
  }
}
export default new AuthRoutes().router;
