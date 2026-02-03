import { Router } from "express";
import { AUTH, CRUD } from "../constants/endpoint.constant";
import authRoutes from "./auth/auth.routes";
import indexMiddlewares from "./index.middlewares";

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
  }
}

export default new IndexRoutes().router;
