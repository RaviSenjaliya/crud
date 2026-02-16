import { Router } from "express";
import { ROOT } from "../../constants/endpoint.constant";
import userControllers from "./user.controllers";

class UserRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes(): void {
    this.router.post(ROOT, userControllers.createUser);
  }
}
export default new UserRoutes().router;
