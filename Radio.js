const MPlayer = require('mplayer');
const playlist = require('./playlist.js');

const config = {
  cacheMin: 1,
  cache: 128,
};

class Radio {
  constructor() {
    this.activeRadio = 0;
    this.muted = false;
    this.volume = 50;
    this.playing = false;
    this.title = '';
    this.playlist = playlist;
    this.player = new MPlayer(false, true);

    this.pendingUpdate = false;
  }

  initalize() {
    this.player.on('start', () => this.next());
    this.player.on('status', () => this.updateRadio());
  }

  updateRadio() {
    this.muted = this.player.status.muted;
    this.volume = this.player.status.volume;
    this.playing = this.player.status.playing;
    this.title = !this.player.status.title
      ? this.playlist[this.activeRadio].name
      : this.player.status.title;

    this.pendingUpdate = true;
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

  getAsync() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Took to long to update')), 3000);
      while (this.pendingUpdate) {
        // Do nothing
      }
      return resolve(this.get());
    });
  }

  pause() {
    this.player.pause();
  }

  resume() {
    this.player.resume();
  }

  mute() {
    this.player.mute();
  }

  next() {
    this.changeIndex(true);
    this.player.openFile(this.playlist[this.activeRadio].url, config);
    this.player.play();
  }

  prev() {
    this.changeIndex();
    this.player.openFile(this.playlist[this.activeRadio].url, config);
    this.player.play();
  }

  setVolume(volume) {
    this.player.volume = volume;
  }

  changeIndex(isNext = false) {
    if (isNext) {
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
