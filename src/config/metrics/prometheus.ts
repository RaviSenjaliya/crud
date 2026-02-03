import {
  collectDefaultMetrics,
  register,
  Histogram,
  Counter,
} from "prom-client";

// collect machine / process metrics
collectDefaultMetrics({ register });

// request duration histogram
export const requestResponseTimeHistogram = new Histogram({
  name: "http_request_response_time_ms",
  help: "HTTP request response time in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [50, 100, 200, 300, 400, 500, 800, 1000, 2000],
});

// total request counter
export const totalRequestsCounter = new Counter({
  name: "http_total_requests",
  help: "Total number of HTTP requests",
});

export { register };
