const express = require('express');
const {
  startNewGame,
  processTargetGuess,
  checkForCompletion,
} = require('../controllers/gameController');
const { verifyToken } = require('../lib/utils');

const gameRouter = express();

gameRouter.get('/:imageName', startNewGame);

gameRouter.post('/target', verifyToken, processTargetGuess);

gameRouter.post('/completed', verifyToken, checkForCompletion);

module.exports = gameRouter;
