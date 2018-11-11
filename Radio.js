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

    this.player.on('ready', () => this.changeSong('next'));
  }

  updateRadio() {
    console.log('update was called!');

    this.muted = this.player.status.muted;
    this.volume = this.player.status.volume;
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

  onChange(event, resolve) {
    if (event !== 'status') {
      return () => {
        console.log('onChange');
        this.updateRadio();
        this.player.removeListener(event, this.onChange(event));
        resolve(this.get());
      };
    }

    return (status) => {
      console.log('status: ', status);
      this.player.removeListener(event, this.onChange(event));
      this.updateRadio();
      resolve(this.get());
    };
  }

  promise(cb, event) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.player.removeListener(event, this.onChange(event));
        reject(new Error('Timeout'));
      }, 10000);
      this.player.on(event, this.onChange(event, resolve));
      console.log('running callback for', event);
      cb();
    });
  }

  pause() {
    const cb = () => this.player.pause();
    return this.promise(cb, 'pause');
  }

  resume() {
    const cb = () => this.player.play();
    return this.promise(cb, 'play');
  }

  mute() {
    const cb = () => this.player.mute();
    return this.promise(cb, 'status');
  }

  changeSong(direction) {
    const cb = () => {
      this.changeIndex(direction);
      this.player.openFile(this.playlist[this.activeRadio].url, config);
      this.player.play();
    };

    return this.promise(cb, 'start');
  }

  setVolume(volume) {
    const cb = () => this.player.volume(volume);
    return this.promise(cb, 'status');
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
