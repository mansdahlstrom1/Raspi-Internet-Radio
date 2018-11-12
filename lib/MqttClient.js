const dotenv = require('dotenv');
const mqtt = require('async-mqtt');

dotenv.load();

const {
  MQTT_USERNAME,
  MQTT_PASSWORD,
  MQTT_ENDPOINT,
} = process.env;

class MqttClient extends mqtt.AsyncClient {
  constructor() {
    const options = {
      clientId: 'radio-pi',
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
    };
    const client = mqtt.connect(MQTT_ENDPOINT, options);
    super(client);

    this.on('connect', this.connect);
  }

  async connect() {
    console.log('connect');
    try {
      console.log('trying to connect');
      await this.subscribe('radio/get');
      await this.subscribe('radio/pause');
      await this.subscribe('radio/resume');
      await this.subscribe('radio/mute');
      await this.subscribe('radio/next');
      await this.subscribe('radio/prev');
      await this.subscribe('radio/volume');
      console.log('connected and subscribed');
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = MqttClient;
