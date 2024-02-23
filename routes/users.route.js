const { Router } = require("express");
const postgres = require("@vercel/postgres");
const notes = require("./notes.route");
const createTables = require("../lib/createTables");

const r = Router({ mergeParams: true });

r.use("/:id", notes);

r.get("/", async (req, res) => {
  createTables();
  /* const  user  = req.params.user; */
  const { user } = req.params;

  /* select all notes from a specific user */
  const { rows } =
    await postgres.sql`SELECT * FROM users LEFT JOIN notes ON notes."userId" = users.id WHERE users.name = ${user}`;

  return res.json(rows);
});

r.post("/", async (req, res) => {
  await createTables();
  const user = req.params.user;
  const { content } = req.body;

  if (content) {
    /* create a new user if that user doesn't already exist */
    await postgres.sql`INSERT INTO users (name) VALUES (${user}) ON CONFLICT DO NOTHING`;

    /* get the id of the newly created user */
    const {
      rows: [{ id }],
    } = await postgres.sql`SELECT id FROM users WHERE users.name=${user}`;

    /* create a new note for that user */
    await postgres.sql`INSERT INTO notes (content, "userId") VALUES (${content}, ${id})`;

    return res.json("Successfully created note");
  } else {
    return res.json("Note NOT created since content is missing.");
  }
});

module.exports = r;
