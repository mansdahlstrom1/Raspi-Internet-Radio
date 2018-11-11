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
    let cb = radio.pause;
    if (!radio.playing) {
      cb = radio.resume;
    }

    const state = await radio.promise(cb);
    res.json(state);
  } catch (err) {
    res.json(400, err.message);
  }
});

app.get('/next', async (req, res) => {
  try {
    const state = await radio.promise(() => radio.next());
    res.json(state);
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
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
