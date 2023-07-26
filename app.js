const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
app.use(express.json());
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

let convertObObjectToResponseObject = (obj) => {
  return {
    player_id: obj.player_id,
    player_name: obj.player_name,
    jersey_number: obj.jersey_number,
    role: obj.role,
  };
};
app.get("/players/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      cricket_team;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(
    booksArray.map((eachplayer) => convertObObjectToResponseObject(eachplayer))
  );
});
module.exports = app;
