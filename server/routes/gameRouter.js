const express = require('express');
const {
  startNewGame,
  processTargetGuess,
  saveResults,
} = require('../controllers/gameController');
const { verifyToken } = require('../lib/utils');

const gameRouter = express();

gameRouter.get('/:imageName', startNewGame);

gameRouter.post('/target', verifyToken, processTargetGuess);

gameRouter.post('/saveResults', verifyToken, saveResults);

module.exports = gameRouter;
