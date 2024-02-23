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

//TODO
r.delete("/", async (req, res) => {
  /* Hints:
   * - you need both params that are passed down via req.params
   * - you will need to figure out the id of the user
   * - then you will be able to query the db with a DELETE statement
   * - return a JSON like { error: "note not found" } when the db didn't delete anything
   * - if deletion was successful then return a text with a success message
   */

  return res.json("route not yet implemented.");
});

module.exports = r;
