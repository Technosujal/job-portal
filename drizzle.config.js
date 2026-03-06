export default {
  out: "./migrations",
  schema: "./shared/schema.js",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:sqlite.db",
  },
};
