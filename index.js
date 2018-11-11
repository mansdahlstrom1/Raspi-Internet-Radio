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

app.get('/pause', (req, res) => {
  if (radio.playing) {
    radio.pause();
  } else {
    radio.resume();
  }
  res.json(radio.get());
});

app.get('/next', (req, res) => {
  radio.next();
  res.json(radio.get());
});

app.get('/prev', (req, res) => {
  radio.prev();
  res.json(radio.get());
});

app.get('/mute', (req, res) => {
  radio.mute();
  res.json(radio.get());
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
