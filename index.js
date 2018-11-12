const MqttClient = require('./lib/MqttClient');
const Radio = require('./lib/Radio');

const client = new MqttClient();
const radio = new Radio();

// Handle incoming messages
client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message);
    console.log(topic);
    console.log(data);

    switch (topic) {
      case 'radio/get':
        client.publish('radio/update', JSON.stringify(radio.get()));
        break;
      case 'radio/pause':
        radio.pause();
        break;
      case 'radio/resume':
        radio.resume();
        break;
      case 'radio/mute':
        radio.mute();
        break;
      case 'radio/next':
        radio.changeSong('next');
        break;
      case 'radio/prev':
        radio.changeSong('prev');
        break;
      case 'radio/volume':
        radio.setVolume(data.volume);
        break;
      default:
        console.log('default message');
    }
  } catch (err) {
    console.error(err);
    console.error('whoops!');
  }
});

// publish radio events to subscribers
const publishRadioUpdate = topic => async () => {
  try {
    radio.updateRadio();
    await client.publish(`radio/${topic}`, JSON.stringify(radio.get()));
    console.log(`published event to ${topic}`);
  } catch (err) {
    console.error(err);
  }
};

radio.player.on('start', publishRadioUpdate('update'));
radio.player.on('play', publishRadioUpdate('update'));
radio.player.on('pause', publishRadioUpdate('update'));
radio.player.on('stop', publishRadioUpdate('update'));
radio.player.on('play', publishRadioUpdate('update'));
radio.player.on('status', publishRadioUpdate('status'));
