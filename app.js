const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
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
    playerId: obj.player_id,
    playerName: obj.player_name,
    jerseyNumber: obj.jersey_number,
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
/*get player id*/
app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let query = `
    select * from cricket_team
    where player_id=${playerId};`;
  let res = await db.get(query);
  response.send(convertObObjectToResponseObject(res));
  //response.send(res);
});

/*post a[i 3*/
app.post("/players/", async (request, response) => {
  const bookDetails = request.body;
  const { playerName, jerseyNumber, role } = bookDetails;
  const addBookQuery = `
    INSERT INTO
      cricket_team(player_name,jersey_number,role)
    VALUES
      (
      '${playerName}',
      ${jerseyNumber},
      '${role}');`;

  const dbResponse = await db.run(addBookQuery);
  console.log("player added");
  response.send("Player Added to Team");
});
module.exports = app;
/*API 4*/
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const bookDetails = request.body;
  const { playerName, jerseyNumber, role } = bookDetails;
  const updateBookQuery = `
    UPDATE
      cricket_team
    SET
    player_id=${playerId},
     player_name='${playerName}',
     jersey_number=${jerseyNumber},
     role='${role}'
    WHERE
      player_id = ${playerId};`;
  await db.run(updateBookQuery);
  response.send("Player Details Updated");
});

/*api 5*/
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteBookQuery = `
    DELETE FROM
     cricket_team
    WHERE
       player_id= ${playerId};`;
  await db.run(deleteBookQuery);
  response.send("Player Removed");
});
