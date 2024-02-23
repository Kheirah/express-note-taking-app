const postgres = require("@vercel/postgres");

async function createTables() {
  await postgres.sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
  await postgres.sql`
          CREATE TABLE IF NOT EXISTS notes (
              id SERIAL PRIMARY KEY,
              content VARCHAR(255) NOT NULL,
              "userId" integer REFERENCES users (id),
              "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
              );
          `;
}

module.exports = createTables;
