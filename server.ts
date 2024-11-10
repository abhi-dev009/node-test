import app from "./src/app";
import config from "./src/config";
import { ERRORS } from "./src/constants";

// handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(ERRORS.SHUTDOWN);
  process.exit(1);
});

// config
console.log(`NODE_ENV=${config.NODE_ENV}`);

// connecting to database

const server = app.listen(config.PORT, () => {
  console.log(`running on  ${config.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log(ERRORS.SHUTDOWN_UNHANDLED);

  server.close(() => {
    process.exit(1);
  });
});
