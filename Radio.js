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

    this.pendingUpdate = false;
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


  myPromise(cb, event) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 3000);
      this.player.on(event, this.onChange(event, resolve));
      cb();
    });
  }

  pause() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 3000);
      this.player.on('pause', () => {
        this.updateRadio();
        this.player.removeListener('pause', () => {});
        resolve(this.get());
      });
      this.player.pause();
    });
  }

  resume() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 3000);
      this.player.on('resume', () => {
        this.updateRadio();
        resolve(this.get());
      });
      this.player.resume();
    });
  }

  mute() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 3000);
      this.player.on('status', ({ muted }) => {
        console.log('status for muted', muted);
        this.player.on('status', () => {});
        this.updateRadio();
        resolve(this.get());
      });
      this.player.mute();
    });
  }

  changeSong(direction) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 3000);
      this.player.on('start', () => {
        this.updateRadio();
        resolve(this.get());
      });
      this.changeIndex(direction);
      this.player.openFile(this.playlist[this.activeRadio].url, config);
      this.player.play();
    });
  }

  setVolume(volume) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 3000);
      this.player.on('status', ({ volume: newVolume }) => {
        console.log('update', this.volume, newVolume);
        this.player.on('status', () => {});
        this.updateRadio();
        resolve(this.get());
      });
      this.player.volume = volume;
    });
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
