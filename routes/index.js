//@ts-check
"use strict"

module.exports = () => {
  const express = require('express');
  const router = express.Router();

  const register = require('../controller/register');
  const login = require('../controller/login');

  const game = require('../controller/game');

  router.post("/api/game/create",
  game.createGame
  );

  router.post("/api/game/:game_id/ticket/:user_name/generate",
  game.createTicket
  );
 
  router.get("/ticket/:ticket_id",
  game.ticketById
  );

  router.get("/api/game/:game_id/number/random",
  game.getRandomNumber
  );

  router.get("/api/game/:game_id/numbers",
  game.getAllocatedNumbers
  );

  router.get("/api/game/:game_id/stats",
  game.stats
  );

  router.post("/user/signup",
    register.validateBody,
    register.signup
  );

  router.post("/user/login",
    login.validateBody,
    login.signin
  );

  router.all("*", (req, res) => {
    res.status(401).json({ error: "Unauthorised access", code: 401 });
  });

  return router;
}
