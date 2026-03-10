const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const environment = process.env.NODE_ENV === "production" ? "production" : "development";
const prefix = environment === "production" ? "PROD" : "DEV";
const isLoggingEnabled = process.env[`${prefix}_DB_LOGGING`] === "true";

const dbConfig = {
  dialect: process.env[`${prefix}_DB_DIALECT`] || "sqlite",
  storage:
    process.env[`${prefix}_DB_STORAGE`] ||
    (environment === "production"
      ? "./database/music_library_prod.db"
      : "./database/music_library.db"),
  logging: isLoggingEnabled ? console.log : false
};

module.exports = {
  dbConfig,
  environment
};
