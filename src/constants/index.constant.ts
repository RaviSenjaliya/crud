export const HEADER = {
  X_REQUEST_ID: "X-Request-Id",
};

export const CHAR_SET =
  "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const RANDOM_ID_STRING_LENGTH = 8;

// for morgan
export const API_CALL_INWARD = "apiCallInward";
export const HOST_REGEX = /[A-Z-]+\.service/i;
export const NOT_ALLOWED_HTTP_METHOD_FOR_LOGS = ["GET"];
export const NOT_ALLOWED_HTTP_ENDPOINT_FOR_LOGS = [
  "/filter",
  "/report",
  "/metrics",
];
export const NOT_ALLOWED_HTTP_ENDPOINT_FOR_MORGAN = ["/metrics", "/actuator"];

// tbl ids prefix
export const USER_PREFIX = "usr";
