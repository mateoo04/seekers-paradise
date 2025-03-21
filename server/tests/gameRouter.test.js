const gameRouter = require('../routes/gameRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/game', gameRouter);

describe('Game API Endpoints', () => {
  let token = '';
  let piggy, clown;

  it('should start a new game, return the image URL and targets', async () => {
    const res = await request(app).get('/api/game/viking-raid');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token.token;

    expect(res.body).toHaveProperty('image');
    expect(res.body.targets.length).toBeGreaterThan(1);

    piggy = res.body.targets.find(
      (target) => target.character.name === 'Piggy'
    );

    clown = res.body.targets.find(
      (target) => target.character.name === 'Clown'
    );
  });

  it('should return false after a wrong guess', async () => {
    const res = await request(app)
      .post('/api/game/target')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        clickX: 10,
        clickY: 90,
        targetId: piggy.id,
      });

    expect(res.body.isFound).toBe(false);
  });

  it('should return true after a successful guess', async () => {
    const res = await request(app)
      .post('/api/game/target')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        clickX: 40.225,
        clickY: 51.7,
        targetId: piggy.id,
      });

    expect(res.body.isFound).toBe(true);
  });

  it('should not save results of unfinished game', async () => {
    const res = await request(app)
      .post('/api/game/saveResults')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({ username: 'test' });

    expect(res.statusCode).toBe(401);
  });

  it('should return game duration time after a final successful guess', async () => {
    const res = await request(app)
      .post('/api/game/target')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        clickX: 34.225,
        clickY: 33.7,
        targetId: clown.id,
      });

    expect(res.body.gameSessionStatus).toHaveProperty('gameDuration');
  });

  it('should save results', async () => {
    const res = await request(app)
      .post('/api/game/saveResults')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({ username: 'test' });

    expect(res.body.success).toBe(true);
  });
});
