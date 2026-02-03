export const INVALID_REFRESH_TOKEN = "invalid_refresh_token";
export const INVALID_REQUEST_ERROR = "invalid_request_error";
export const FORBIDDEN_REQUEST = "forbidden_request";
export const LOGIN_FAILED = "login_failed";
export const NOT_AUTHORIZED = "not_authorized_exception";
export const MISSING_COGNITO_IAM_CREDENTIALS = "credentials_provider_error";
export const USER_NOT_CONFIRMED = "UserNotConfirmedException";
export const USER_NAME_EXISTS = "UsernameExistsException";

export const USERNAME_ALREADY_EXIST =
  "This email address has already been registered. Try a different email address.";
export const USER_NOT_CONFIRMED_MSG =
  "User is not confirmed. Please confirm your email address.";
export const INVALID_EMAIL_PASSWORD =
  "Incorrect email or password. Please try again.";
export const INVALID_PASSWORD_MSG =
  "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol, minimum 8 character long, maximum 16 character long.";
export const PARAMETER_MISSING = "Missing required parameter(s)";
export const ACCESS_DENIED = "You are not authorized for this request";
export const FIELD_BLANK = "{{field}} must not be blank.";
export const INVALID_PARAMETER =
  "The {{field1}} is invalid. Please enter the correct {{field2}}.";
export const HEADER_MISSING = "{{header}} header is missing.";
export const INTERNAL_SERVER_ERROR_MSG = "Internal Server Error.";
export const NO_SUCH_ENTITY = "No such {{entity}}: '{{parameter}}'.";
export const INVALID_REQUEST_PARAMETER =
  "Invalid {{parameter}}. Your request cannot be completed.";
export const INVALID_VERSION =
  "Invalid API version: '{{version}}'. Please enter correct one.";
export const INVALID_LIMIT_RANGE: string = `{{field}} must be between {{min}} to {{max}}.`;
export const OPERATOR_ERROR =
  "{{field1}} operator is not supported in {{field2}} field";
export const VALUE_LENGTH_ERROR =
  "{{field1}} operator required {{field2}} length in {{field3}}'s value field";
export const INVALID_AMOUNT_LENGTH = `More than 16 digits are not allowed in amount field`;
export const VALUE_TYPE_ERROR =
  "Only {{field1}} value is allowed in {{field2}} field";
export const INVALID_CREATED_LENGTH = `Exactly 13 digits required in created value field`;
