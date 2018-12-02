# radio-pi

> A simple Internet radio player for mPlayer with REST API integration and MQTT client

## Usage

You will need a mqtt broker running to enable the MQTT part of the radio

```
const {
  MQTT_USERNAME,
  MQTT_PASSWORD,
  MQTT_ENDPOINT,
} = process.env;
```

1. Install mPlayer on your device `sudo apt-get install mplayer`
2. Clone this repository
3. `cd radio-pi`
4. `npm run start`


## TODO

use https://www.npmjs.com/package/node-mpv instead fo mPlayer
