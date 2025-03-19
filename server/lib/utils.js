const jwt = require('jsonwebtoken');

function issueJWT(gameSession) {
  const token = jwt.sign({ id: gameSession.id }, process.env.SECRET, {
    expiresIn: '1d',
  });

  return {
    token: 'Bearer ' + token,
    expiresIn: Date.now() + 24 * 60 * 60 * 1000,
  };
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.gameSession = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = { issueJWT, verifyToken };
