import { Router } from "express";
import { AUTH, CRUD, USER } from "../constants/endpoint.constant";
import authRoutes from "./auth/auth.routes";
import indexMiddlewares from "./index.middlewares";
import userRoutes from "./user/user.routes";

class IndexRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes(): void {
    const validationMiddlewares = [
      indexMiddlewares.validateAPIRequestComponent(),
      indexMiddlewares.reportValidationResult,
    ];

    this.router.use(`${CRUD}${AUTH}`, validationMiddlewares, authRoutes);
    this.router.use(`${CRUD}${USER}`, validationMiddlewares, userRoutes);
  }
}

export default new IndexRoutes().router;
