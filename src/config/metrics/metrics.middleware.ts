import { Request, Response } from "express";
import responseTime from "response-time";
import {
  requestResponseTimeHistogram,
  totalRequestsCounter,
} from "./prometheus";

export const metricsMiddleware = responseTime(
  (req: Request, res: Response, time: number) => {
    totalRequestsCounter.inc();

    requestResponseTimeHistogram
      .labels(req.method, req.route?.path || req.url, res.statusCode.toString())
      .observe(time);
  }
);
