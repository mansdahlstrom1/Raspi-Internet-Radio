const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Radio = require('./lib/Radio');

const app = express();

const radio = new Radio();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json(radio.get());
});

app.get('/pause', (req, res) => {
  try {
    if (!radio.playing) {
      radio.resume();
    } else {
      radio.pause();
    }

    res.json({});
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

app.get('/next', (req, res) => {
  try {
    radio.changeSong('next');
    res.json({});
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

app.get('/prev', (req, res) => {
  try {
    radio.changeSong('prev');
    res.json({});
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

app.get('/mute', (req, res) => {
  try {
    radio.mute();
    res.json({});
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});


app.post('/setVolume', (req, res) => {
  const {
    volume,
  } = req.body;

  try {
    radio.setVolume(volume);
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

app.listen(3000, () => {
  console.log('Radio Pi listening on port 3000!');
});
