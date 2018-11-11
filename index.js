const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Radio = require('./Radio');

const app = express();

const radio = new Radio();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json(radio.get());
});

app.get('/pause', async (req, res) => {
  try {
    if (radio.playing) {
      radio.pause();
    } else {
      radio.resume();
    }
    const state = await radio.getAsync();
    res.json(state);
  } catch (err) {
    res.json(400, err.message);
  }
});

app.get('/next', async (req, res) => {
  try {
    radio.next();

    const state = await radio.getAsync();
    res.json(state);
  } catch (err) {
    res.json(400, err.message);
  }
});

app.get('/prev', (req, res) => {
  radio.prev();
  res.json(radio.get());
});

app.get('/mute', (req, res) => {
  radio.mute();
  res.json(radio.getAsync());
});


app.post('/setVolume', (req, res) => {
  if (req.body.volume > 100 && req.body.volume < 0) {
    return res.status(400).json({
      message: 'Invalid Volume',
      statusCode: 400,
    });
  }

  radio.setVolume(req.body.volume);

  return res.json(radio.get());
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
  radio.initalize();
});
