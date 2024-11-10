const ERRORS = {
  SHUTDOWN: "Shuting down the server due to Uncaught Exception",
  SHUTDOWN_UNHANDLED:
    "Shuting down the server due to Unhandled Promise Rejection",
  INTERNAL_SERVER_DOWN: "Internal server error",
  RESOURCE_NOT_FOUND: "Resource not found. Invalid:",
};

const STATUS_CODES = {
  OK: 200,
  OK_WITH_CREATION: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED_ACCESS: 401,
  NOT_FOUND: 404,
  UNEXPECTED_CONDITION: 500,
} as const;

export { STATUS_CODES, ERRORS };
