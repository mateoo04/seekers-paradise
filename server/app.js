require('dotenv').config();
const express = require('express');
const cors = require('cors');

const indexRouter = require('./routes/indexRouter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) =>
  res.json({ message: "Welcome to the Seekers' Paradise API!" })
);

app.use('/api', indexRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(process.env.PORT || 4000, () =>
  console.log(`Server listening on port ${process.env.PORT || 4000}!`)
);
