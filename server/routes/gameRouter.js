const express = require('express');
const {
  startNewGame,
  processTargetGuess,
} = require('../controllers/gameController');
const { verifyToken } = require('../lib/utils');

const gameRouter = express();

gameRouter.get('/:imageName', startNewGame);

gameRouter.post('/target', verifyToken, processTargetGuess);

module.exports = gameRouter;
