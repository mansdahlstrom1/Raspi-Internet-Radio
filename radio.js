const express   = require('express')
const app       = express()
const cors      = require('cors')
const playlist  = require('./playlist.js')
const MPlayer   = require('mplayer')
const player    = new MPlayer(false,true);

let radio = {
    activeRadio: 0,
    muted: false,
    volume: 50,
    playing: false,
    title: "",
    playlist: playlist
}

app.use(cors());

updateRadio = function(req, res){
    player.on('start', () => {
        radio.muted     = player.status.muted
        radio.volume    = player.status.volume
        radio.playing   = player.status.playing
        radio.title     = player.status.title == null ? radio.playlist[radio.activeRadio].name : player.status.title
        console.log(radio.title)
        if (!res.headersSent)
            res.json(radio)
    })

}

playerInit = function(){
    player.volume(radio.volume)
    player.on('ready', () => {
        radio.muted     = player.status.muted
        radio.volume    = player.status.volume
        radio.playing   = player.status.playing
        radio.title     = player.status.title == null ? radio.playlist[radio.activeRadio].name : player.status.title
    })
    playSong()
}

playSong = function() {
    player.openFile(radio.playlist[radio.activeRadio].url, {
        cache: 128,
        cacheMin: 1
    })
    player.play()
}

changeIndex = function(isNext){
    if (isNext) {
        if (radio.activeRadio == radio.playlist.length - 1) 
            radio.activeRadio = 0
        else 
            radio.activeRadio++
    } else {
        if (radio.activeRadio == 0) 
            radio.activeRadio = radio.playlist.length - 1
        else 
            radio.activeRadio--
    }  
}

app.get('/', function (req, res) {
  res.json(radio)
})

app.get('/pause', (req, res ) => {
    if (radio.playing) 
        player.pause()
    else
        player.play()    
    res.json(radio)
})

app.get('/next', (req, res) => {
    changeIndex(true);
    playSong()
    updateRadio(req, res) 
})

app.get('/prev', (req, res) => {
    changeIndex(false);
    playSong()
    updateRadio(req, res)
})

app.get('/raiseTheVolume', (req, res) => {
    if (radio.volume < 100) {
        radio.volume += 5
        player.volume(radio.volume)
    }   
    res.json(radio);
})

app.get('/lowerTheVolume', (req, res) => {
    if (radio.volume > 0) {
        radio.volume -= 5
        player.volume(radio.volume)
    } 
    res.json(radio) 
})

app.get('/mute', (req, res) => {
    player.mute()
    radio.muted = !radio.muted
    res.json(radio)
})

app.get('/test', (req, res) => {
    console.log("Hey! /test was called");
    updateRadio(req, res)
})

app.listen(3000,  () => {
  console.log('Example app listening on port 3000!')
  playerInit()
})