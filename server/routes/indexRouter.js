const express = require('express');
const homeRouter = require('./homeRouter');
const gameRouter = require('./gameRouter');

const indexRouter = express();

indexRouter.use('/images', homeRouter);
indexRouter.use('/game', gameRouter);

module.exports = indexRouter;
