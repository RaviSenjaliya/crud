import * as api from "../constants/endpoint.constant";

const POST = "POST";
const PUT = "PUT";
const GET = "GET";
const DELETE = "DELETE";

const filterAndSortValidators = [
  //filter
  "validateFilterType",
  "validateFilterField",
  "validateFilterValue",
  //sort
  "validateSortField",
  "validateSortOrder",
];

const filterValidators = [
  "validateFilterType",
  "validateFilterField",
  "validateFilterValue",
];

const sortValidators = ["validateSortField", "validateSortOrder"];

// if module name is in kebab-case, convert it to camel case (e.g. node-management -> nodeManagement , loop-out -> loopOut)

const apis: Record<string, Record<string, Record<string, string[]>>> = {
  //accounts module
  ["test"]: {
    [POST]: {},
    [GET]: {},
    [PUT]: {},
    [DELETE]: {},
  },
};

export default apis;
