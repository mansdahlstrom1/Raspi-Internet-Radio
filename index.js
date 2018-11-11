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
    let state;
    if (!radio.playing) {
      state = await radio.resume();
    } else {
      state = await radio.pause();
    }

    res.json(state);
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

app.get('/next', async (req, res) => {
  try {
    const state = await radio.changeSong('next');
    res.json(state);
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

app.get('/prev', async (req, res) => {
  try {
    const state = await radio.changeSong('prev');
    res.json(state);
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

app.get('/mute', async (req, res) => {
  try {
    const state = await radio.mute();
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
<<<<<<< HEAD
=======

  console.log('volume', typeof volume, volume);
>>>>>>> dev
  if (volume > 100 || volume < 0) {
    res.status(400).json({
      message: 'Invalid Volume',
      statusCode: 400,
    });
    return;
<<<<<<< HEAD
  }

  if (volume === radio.volume) {
    res.json(radio.get());
    return;
  }

  try {
    const state = await radio.setVolume(volume);
    res.json(state);
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
=======
  }

  if (volume === radio.volume) {
    res.json(radio.get());
    return;
  }

  try {
    const state = await radio.setVolume(volume);
    res.json(state);
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

app.get('/status', async (req, res) => {
  res.json({
    eventListners: {
      start: radio.player.listenerCount('start'),
      status: radio.player.listenerCount('status'),
      pause: radio.player.listenerCount('pause'),
      play: radio.player.listenerCount('play'),
    },
  });
>>>>>>> dev
});

app.listen(3000, () => {
  console.log('Radio Pi listening on port 3000!');
});
