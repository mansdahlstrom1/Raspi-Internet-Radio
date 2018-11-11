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

app.get('/prev', async (req, res) => {
  try {
    const state = await radio.promise(() => radio.prev());
    res.json(state);
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

app.get('/mute', async (req, res) => {
  try {
    const state = await radio.promise(() => radio.mute());
    res.json(state);
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});


app.post('/setVolume', async (req, res) => {
  const {
    volume,
  } = req.body;
  if (volume > 100 || volume < 0) {
    res.status(400).json({
      message: 'Invalid Volume',
      statusCode: 400,
    });
    return;
  }

  if (volume === radio.volume) {
    res.json(radio.get());
    return;
  }

  try {
    const state = await radio.promise(() => radio.setVolume(volume));
    res.json(state);
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
  radio.initalize();
});
