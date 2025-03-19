const express = require('express');
const imagesRouter = require('./imagesRouter');
const gameRouter = require('./gameRouter');

const indexRouter = express();

indexRouter.use('/images', imagesRouter);
indexRouter.use('/game', gameRouter);

module.exports = indexRouter;
