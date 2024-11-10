"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const config_1 = __importDefault(require("./src/config"));
const constants_1 = require("./src/constants");
// handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(constants_1.ERRORS.SHUTDOWN);
    process.exit(1);
});
// config
console.log(`NODE_ENV=${config_1.default.NODE_ENV}`);
// connecting to database
const server = app_1.default.listen(config_1.default.PORT, () => {
    console.log(`running on  ${config_1.default.PORT}`);
});
// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(constants_1.ERRORS.SHUTDOWN_UNHANDLED);
    server.close(() => {
        process.exit(1);
    });
});
