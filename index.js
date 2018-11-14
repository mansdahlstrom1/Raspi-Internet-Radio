const MqttClient = require('./lib/MqttClient');
const Radio = require('./lib/Radio');

const client = new MqttClient();
const radio = new Radio();

// Handle incoming messages
client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message);

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
        client.publish('radio/update', JSON.stringify(radio.get()));
        break;
      default:
        console.log('No action specified for this topic');
    }
  } catch (err) {
    console.error(err);
    console.error('whoops!');
  }
});

// publish radio events to subscribers
const publishRadioUpdate = topic => (status) => {
  try {
    console.log(status);
    radio.updateRadio(status || radio.player.status);
    client.publish(
      `radio/${topic}`,
      JSON.stringify(radio.get()),
    ).then(() => {
      console.log(`published event to ${topic}`);
    }).catch(err => console.log(err));
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
