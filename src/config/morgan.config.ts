import { Request, Response } from "express";
import morgan from "morgan";
import {
  API_CALL_INWARD,
  HOST_REGEX,
  NOT_ALLOWED_HTTP_ENDPOINT_FOR_LOGS,
  NOT_ALLOWED_HTTP_ENDPOINT_FOR_MORGAN,
  NOT_ALLOWED_HTTP_METHOD_FOR_LOGS,
} from "../constants/index.constant";

/*
 *  sets uri token to formatted full URL of the API
 */
const setUriToken = (request: Request): string => {
  return `${request.protocol}://${request.hostname}${request.originalUrl}`;
};
morgan.token("uri", setUriToken);

/*
 *  sets body token to the HTTP request body
 */
const setBodyToken = (request: Request): string => request.body;
morgan.token("body", setBodyToken);

/*
 *  sets headers token to the HTTP request headers
 */
const setHeaderToken = (request: Request): string => {
  const headers = { ...request.headers }; // Create a copy to avoid modifying original headers
  delete headers["access"];
  delete headers["authorization"];

  return JSON.stringify(headers);
};
morgan.token("headers", setHeaderToken);

/*
 *  sets the server path token to the path of the API
 */
const setServerPathToken = (request: Request): string => request.originalUrl;
morgan.token("server_path", setServerPathToken);

/*
 *  sets the status token to the status code of HTTP response
 */
const setStatusToken = (_: Request, response: Response): string => {
  return response.statusCode.toString();
};
morgan.token("status", setStatusToken);

/*
 *  sets the total time to the elapsed time of the HTTP request processing
 */
const setTotalTimeToken = (request: Request): string => {
  const totalTime = new Date().getTime() - request.time;
  return totalTime.toString();
};
morgan.token("totalTime", setTotalTimeToken);

/*
 *  sets the time at which the HTTP request was received on the server
 */
const setTimeToken = (request: Request): string => {
  return new Date(request.time).toString();
};
morgan.token("time", setTimeToken);

/*
 *  sets the user agent token to the user-agent HTTP header
 */
const setUserAgentToken = (request: Request): string =>
  request.get("user-agent");
morgan.token("user-agent", setUserAgentToken);

/*
 *  sets the host token to the host HTTP header
 */
const setHostToken = (request: Request): string => request.get("host");
morgan.token("host", setHostToken);

/*
 *  sets the accept token to the accept HTTP header
 */
const setAcceptToken = (request: Request): string => request.get("accept");
morgan.token("accept", setAcceptToken);

/*
 *  sets the forwarded for token to the x-forwarded-for HTTP header
 */
const setXForwardedForToken = (request: Request): string =>
  request.get("x-forwarded-for");
morgan.token("x-forwarded-for", setXForwardedForToken);

/*
 *  sets the response data to the response_data HTTP header
 */
const setResponseData = (request: Request): any => request.responseData;
morgan.token("response-data", setResponseData);

/*
 *  @param tokens [TokenIndexer] morgan's token indexer for custom tokens
 *  @param request [Request] request object from the API
 *  @param response[Response] response object from the API
 *  @param description collate morgan tokens and return the HTTP data for logging
 */
export const logJSON = (
  tokens: morgan.TokenIndexer,
  request: Request,
  response: Response
) => {
  const host = tokens["host"](request, response);
  const uri = tokens["uri"](request, response);
  const methodType = tokens["method"](request, response);
  const headers = tokens["headers"](request, response);
  const responseData = tokens["response-data"](request, response);
  const includeResData =
    !NOT_ALLOWED_HTTP_ENDPOINT_FOR_LOGS.some((el) => uri.includes(el)) &&
    !NOT_ALLOWED_HTTP_METHOD_FOR_LOGS.includes(methodType);

  let parsedResponseData = undefined;
  if (includeResData && responseData) {
    parsedResponseData = JSON.parse(responseData);
  }

  return NOT_ALLOWED_HTTP_ENDPOINT_FOR_MORGAN.some((el) => uri.includes(el))
    ? undefined
    : JSON.stringify({
        language: "nodejs",
        action: HOST_REGEX.test(host) ? undefined : API_CALL_INWARD,
        host,
        method: methodType,
        uri,
        body: tokens["body"](request, response),
        headers: headers ? JSON.parse(headers) : undefined,
        response_data: parsedResponseData,
        server_path: tokens["server_path"](request, response),
        status: tokens["status"](request, response),
        totalTime: tokens["totalTime"](request, response),
        time: tokens["time"](request, response),
        "user-agent": tokens["user-agent"](request, response),
        accept: tokens["accept"](request, response),
        "x-forwarded-for": tokens["x-forwarded-for"](request, response),
      });
};

export default morgan;
