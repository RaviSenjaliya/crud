import { transports, createLogger, format, Logger } from "winston";
import { TransformableInfo } from "logform";
import LokiTransport from "winston-loki";
import { HEADER } from "../constants/index.constant";

let rid: string;
const { printf } = format;

/**
 * Custom log formatter
 */
const rTracerFormat = printf((info: TransformableInfo) => {
  try {
    const parsedInfo = JSON.parse(info.message as string);
    return JSON.stringify({
      level: info.level,
      [HEADER.X_REQUEST_ID]: rid,
      ...parsedInfo,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return JSON.stringify({
      level: info.level,
      [HEADER.X_REQUEST_ID]: rid,
      message: info.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Uppercase log level
 */
const levelUpperCaseFormatter = format((info) => {
  info.level = info.level.toUpperCase();
  return info;
});

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  http: 5,
};

const logger: Logger = createLogger({
  levels,
  format: format.combine(
    levelUpperCaseFormatter(),
    format.json(),
    rTracerFormat
  ),
  // send to
  transports: [
    // Console logs
    new transports.Console({
      level: "http",
    }),

    // Loki logs winston-loki for graph
    new LokiTransport({
      host: "http://192.168.1.114:3100",
      labels: {
        app: "my-app",
      },
    }),
  ],
});

export const initializeTracer = (requestId: string) => {
  rid = requestId;
};

export default logger;
