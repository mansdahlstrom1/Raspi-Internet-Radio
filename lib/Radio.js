const MPlayer = require('mplayer');
const playlist = require('./playlist.js');

const config = {
  cacheMin: 1,
  cache: 128,
  volume: 50,
};

const delay = ms => new Promise(resolve => setTimeout(resolve(null), ms));

class Radio {
  constructor() {
    this.activeRadio = 0;
    this.muted = false;
    this.volume = 50;
    this.playing = false;
    this.title = '';
    this.playlist = playlist;
    this.player = new MPlayer({ verbose: false, debug: false });

    this.player.on('ready', async () => {
      console.log('onReady');
      this.setVolume(this.volume);
      await delay(1000);
      this.changeSong('next');
    });
  }

  updateRadio() {
    this.muted = this.player.status.muted;
    this.playing = this.player.status.playing;
    this.title = !this.player.status.title
      ? this.playlist[this.activeRadio].name
      : this.player.status.title;
  }

  get() {
    return {
      active: this.activeRadio,
      muted: this.muted,
      volume: this.volume,
      playing: this.playing,
      title: this.title,
    };
  }

  pause() {
    this.player.pause();
  }

  resume() {
    this.player.play();
  }

  mute() {
    this.player.mute();
  }

  changeSong(direction) {
    this.changeIndex(direction);
    this.player.openFile(this.playlist[this.activeRadio].url, config);
    this.player.play();
  }

  setVolume(volume) {
    if (volume > 100) {
      throw new Error('Volume cannot go higher then 100');
    }

    if (volume < 1) {
      this.mute();
    } else {
      this.player.volume(volume);
      this.volume = volume;
    }
  }

  changeIndex(direction) {
    if (direction === 'next') {
      if (this.activeRadio === this.playlist.length - 1) {
        this.activeRadio = 0;
      } else {
        this.activeRadio += 1;
      }
      return;
    }

    if (this.activeRadio === 0) {
      this.activeRadio = this.playlist.length - 1;
    } else {
      this.activeRadio -= 1;
    }
  }
}

module.exports = Radio;
