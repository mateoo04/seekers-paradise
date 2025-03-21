const express = require('express');
const gameRouter = require('./gameRouter');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const indexRouter = express();

indexRouter.use('/game', gameRouter);

indexRouter.get('/images', async (req, res) => {
  try {
    const images = await prisma.image.findMany();

    return res.json({ images });
  } catch (err) {
    next(new Error('Error fetching images: ' + err));
  }
});

indexRouter.get('/ranking/:imageName', async (req, res, next) => {
  try {
    const imageName = req.params.imageName;

    const gameSessions =
      await prisma.$queryRaw`SELECT "GameSession".id, "playerName", EXTRACT(EPOCH FROM ("timeCompleted" - "timeCreated")) AS "gameDurationSeconds"
        FROM "GameSession"
        JOIN "Image"
        ON "Image".id = "GameSession"."imageId"
        WHERE "timeCompleted" IS NOT NULL AND "playerName" IS NOT NULL AND "playerName" != 'test' AND "Image".name = ${imageName}
        ORDER BY "gameDurationSeconds" ASC
        LIMIT 100;`;

    return res.json({ imageName, ranking: gameSessions });
  } catch (err) {
    next(err);
  }
});

module.exports = indexRouter;
