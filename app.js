const express = require("express");
const path = require("path");

const { open } = require("sqlite"ccbp submit NJSCPXTWMS);
const sqlite3 = require("sqlite3");
const app = express();

app.use(express.json());

const dpPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initilizeDbAndServer = async () => {
  try {
    db = await open({ filename: dpPath, driver: sqlite3.Database });
    app.listen(3000);
  } catch (e) {
    console.log(`${e.message}`);
    process.exit(1);
  }
};

initilizeDbAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
       SELECT 
       * 
        FROM
       cricket_team 
    `;
  const dbResponse = await db.all(getPlayersQuery);
  response.send(dbResponse);
});

app.post("/players/", async (request, response) => {
  const bookDetails = request.body;
  const { playerName, jerseyNumber, role } = bookDetails;
  const addPlayerQuery = `
        INSERT INTO 
        cricket_team (player_name, jersey_number, role)
        VALUES (
             "${playerName}",
             ${jerseyNumber},
             "${role}"     
        );`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
        SELECT * FROM
        cricket_team
        WHERE player_id = ${playerId};`;
  const dbResponse = await db.get(getPlayerQuery);
  response.send(dbResponse);
});

app.put("/players/:playerId/", async (request, response) => {
  const playerDetails = request.body;
  const { playerId } = request.params;
  const { playerName, playerNumber, role };

  const updatePlayerQuery = `
       UPDATE cricket_team
       SET 
         player_name = "${playerName}",
         player_number = ${playerNumber},
         role = "${role}"
         
       WHERE player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
       DELETE FROM 
       cricket_team
       WHERE player_id = ${playerId};
    `;

  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
