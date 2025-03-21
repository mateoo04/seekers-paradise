const { issueJWT } = require('../lib/utils');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const startNewGame = async (req, res, next) => {
  try {
    const imageName = req.params.imageName;

    const image = await prisma.image.findUnique({
      where: {
        name: imageName,
      },
      include: {
        characters: true,
      },
    });

    const targets = image.characters.map((character) => ({
      characterId: character.id,
    }));

    const gameSession = await prisma.gameSession.create({
      data: {
        imageId: image.id,
        targets: {
          create: targets,
        },
      },
      include: {
        image: true,
        targets: {
          include: {
            character: true,
          },
        },
      },
    });

    const token = issueJWT(gameSession);
    return res.status(201).json({
      token,
      image: gameSession.image,
      targets: gameSession.targets,
    });
  } catch (err) {
    next(err);
  }
};

const processTargetGuess = async (req, res, next) => {
  try {
    const { clickX, clickY, targetId } = req.body;

    if (!clickX || !clickY || !targetId) return res.status(401);

    const currentTime = new Date();

    const target = await prisma.target.findUnique({
      where: { id: targetId },
      include: {
        character: true,
      },
    });

    const gameSession = await prisma.gameSession.findUnique({
      where: {
        id: req.gameSession.id,
      },
      include: {
        targets: true,
      },
    });

    const selectedTarget = gameSession.targets.find(
      (target) => target.id == targetId
    );

    if (selectedTarget.isFound)
      return res.status(401).json({ message: 'That target was already found' });

    if (
      Math.abs(
        clickX - target.character.xPercent <= 3.5 &&
          Math.abs(clickY - target.character.yPercent) <= 3.5
      )
    ) {
      await prisma.target.update({
        where: {
          id: targetId,
        },
        data: {
          isFound: true,
        },
      });

      let gameSessionStatus = {};
      gameSessionStatus.isCompleted = true;

      gameSession.targets.forEach((target) => {
        if (!target.isFound && target.id !== targetId)
          gameSessionStatus.isCompleted = false;
      });
      if (gameSessionStatus.isCompleted) {
        const updatedGameSession = await prisma.gameSession.update({
          where: {
            id: req.gameSession.id,
          },
          data: {
            timeCompleted: currentTime,
          },
        });

        gameSessionStatus.gameDuration =
          currentTime - updatedGameSession.timeCreated;
      }

      return res.json({
        isFound: true,
        gameSessionStatus,
      });
    } else return res.json({ isFound: false });
  } catch (err) {
    next(err);
  }
};

const saveResults = async (req, res, next) => {
  try {
    const username = req.body.username;

    if (username.length < 3 || username.length > 15)
      return res
        .status(401)
        .json({ message: 'Name must be between 3 and 15 characters long' });

    const gameSession = await prisma.gameSession.findUnique({
      where: {
        id: req.gameSession.id,
      },
      include: {
        targets: true,
      },
    });

    if (!gameSession)
      return res.status(401).json({ message: 'Session not found' });

    if (gameSession.targets.some((target) => !target.isFound))
      return res.status(401).json({
        success: false,
        message: 'Game session unfinished, all targets not found',
      });
    else {
      const gameSessionObj = await prisma.gameSession.update({
        where: {
          id: req.gameSession.id,
        },
        data: {
          playerName: username,
        },
      });

      return res.json({ success: true, gameSession: gameSessionObj });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { startNewGame, processTargetGuess, saveResults };
