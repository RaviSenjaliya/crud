import rTracer from "cls-rtracer";
import cors from "cors";
import express, { Request, Response } from "express";
import actuator from "express-actuator";
import fileUpload from "express-fileupload";
import morgan from "morgan";

import { HEADER } from "../constants/index.constant";
import { ACTUATOR } from "../constants/endpoint.constant";
import indexMiddlewares from "../modules/index.middlewares";
import logger, { initializeTracer } from "./logger.config";
import { logJSON } from "./morgan.config";
import indexRouter from "../modules/";

// metrics imports
import { register } from "../config/metrics/prometheus";
import { metricsMiddleware } from "../config/metrics/metrics.middleware";

class App {
  app: express.Express;

  constructor() {
    this.app = express();
    this.configureApplication();
  }

  configureApplication() {
    // body parsing
    this.app.use(
      express.json({
        verify(req: any, res, buf) {
          req.rawBody = buf;
        },
      })
    );
    this.app.use(express.urlencoded({ extended: false }));

    // cors
    this.app.use(cors());

    // request tracing
    this.app.use(
      rTracer.expressMiddleware({
        requestIdFactory: () => {
          const id = rTracer.id();
          initializeTracer(id as string);
          return id;
        },
        headerName: HEADER.X_REQUEST_ID,
        useHeader: true,
      })
    );

    this.app.use(indexMiddlewares.setRequestId);

    // file upload
    this.app.use(fileUpload());

    // logging
    this.app.use(
      morgan(logJSON, {
        stream: {
          write: (message) => logger.http({ message, rid: rTracer.id() }),
        },
      })
    );

    // PROMETHEUS METRICS
    this.app.use(metricsMiddleware);

    // metrics endpoint
    this.app.get("/metrics", async (_req: Request, res: Response) => {
      res.setHeader("Content-Type", register.contentType);
      res.send(await register.metrics());
    });
    this.app.use(indexRouter);

    // health & actuator
    this.app.use(
      actuator({
        basePath: ACTUATOR,
      })
    );

    // root
    this.app.get("/", (_req: Request, res: Response) => {
      res.send("Hello World!");
    });
  }
}

export default App;
