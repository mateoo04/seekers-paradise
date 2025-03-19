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
  const clickX = req.body.clickX;
  const clickY = req.body.clickY;
  const targetId = req.body.targetId;

  const target = await prisma.target.findUnique({
    where: { id: targetId },
    include: {
      character: true,
    },
  });

  if (target.isFound)
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

    return res.json({
      isFound: true,
    });
  } else return res.json({ isFound: false });
};

const checkForCompletion = async (req, res, next) => {
  const username = req.body.username;

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
    return res.status(401).json({ message: 'Targets not found' });
  else {
    const gameSessionObj = await prisma.gameSession.update({
      where: {
        id: req.gameSession.id,
      },
      data: {
        timeCompleted: new Date(),
        playerName: username,
      },
    });

    return res.json({ isCompleted: true, gameSession: gameSessionObj });
  }
};

module.exports = { startNewGame, processTargetGuess, checkForCompletion };
