import "./tracer";
import { Express } from "express";
import App from "./config/app.config";
import { PORT } from "./config/env.config";
import database from "./database";
import { initLaunchDarkly } from "./config/ld.config";

const startApp = async () => {
  await database.db1.$connect();

  const appInstance = new App();
  const app: Express = appInstance.app;

  await initLaunchDarkly();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startApp();
