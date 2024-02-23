const { Router } = require("express");
const postgres = require("@vercel/postgres");
const createTables = require("../lib/createTables");

const r = Router({ mergeParams: true });

r.get("/", async (req, res) => {
  createTables();
  const { user, id } = req.params;

  /* select a single note from a specific user */
  const { rows } =
    await postgres.sql`SELECT * FROM users LEFT JOIN notes ON notes."userId" = users.id WHERE users.name = ${user} AND notes.id = ${id}`;

  if (!rows.length) {
    return res.json({ message: "note not found" });
  }

  return res.json(rows[0]);
});

r.put("/", async (req, res) => {
  await createTables();
  const user = req.params.user;
  const notesId = req.params.id;
  const { content } = req.body;

  if (content) {
    /* first check to see if we can find the user */
    const {
      rows: [{ id }],
    } = await postgres.sql`SELECT id FROM users WHERE users.name = ${user}`;

    /*
     * returned object looks something like this:
     * { rowCount: 1,
     *     rows: [ { id:1 } ]
     * }
     */

    /* then use that user's id to update the requested note */
    const { rowCount } =
      await postgres.sql`UPDATE notes SET content = ${content} WHERE notes."userId" = ${id} AND notes.id = ${notesId}`;

    if (!rowCount) {
      return res.json({ error: "note not found" });
    }

    return res.json("Successfully edited note");
  } else {
    return res.json("Note NOT created since content is missing.");
  }
});

r.delete("/", async (req, res) => {
  await createTables();
  const user = req.params.user;
  const notesId = req.params.id;

  /* first check to see if we can find the user */
  const {
    rows: [{ id }],
  } = await postgres.sql`SELECT id FROM users WHERE users.name=${user}`;

  /* then use that user's id to delete the requested note */
  const { rowCount } =
    await postgres.sql`DELETE FROM notes WHERE notes."userId"=${id} AND notes.id=${notesId}`;

  if (!rowCount) {
    return res.json({ error: "note not found" });
  }

  return res.json("Successfully deleted note");
});

module.exports = r;
