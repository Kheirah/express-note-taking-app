const { Router } = require("express");
const user = require("./users.route");

const r = Router();

r.use("/:user", user);

r.get("/", async (request, response) => {
  return response.json({ message: "Welcome to the note-taking backend app!" });
});

module.exports = r;
