export default {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ?? 3000,
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  JWT_EXPIRE: process.env.JWT_EXPIRE ?? "",
  API_VERSION: process.env.API_VERSION ?? "",
};
