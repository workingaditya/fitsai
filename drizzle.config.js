export default {
  dialect: "postgresql",
  schema: "./shared/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};