const express = require('express');
const { PrismaClient } = require('@prisma/client');

const imagesRouter = express();
const prisma = new PrismaClient();

imagesRouter.get('/', async (req, res) => {
  try {
    const images = await prisma.image.findMany();

    return res.json({ images });
  } catch (err) {
    next(new Error('Error fetching images: ' + err));
  }
});

module.exports = imagesRouter;
