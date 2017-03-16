const FIFO      = require('fifo-js')
const express   = require('express')
const app       = express()
const playlist  = require('./playlist.js')


let activeRadio = 0; 
let fifo = new FIFO("/tmp/mplayercontrol")
fifo.read(console.log.bind(console))

changeIndex = function(isNext){
    if (isNext) {
        if (activeRadio == playlist.length - 1) 
            activeRadio = 0
        else 
            activeRadio++
    } else {
        if (activeRadio == 0) 
            activeRadio = playlist.length - 1
        else 
            activeRadio--
    }  
}

app.get('/', function (req, res) {
  res.send('Welcome to the Radio Trastvägen')
  console.log(playlist)
})

app.get('/pause', function(req, res ) {
  fifo.write('pause')
  res.send("Nice pause man!")
})

app.get('/next', function(req, res) {
    changeIndex(true);
    let nextChannel = playlist[activeRadio]
    fifo.write("loadfile "+ nextChannel.url)
    res.send("Changes radio channel: \n now playing: " + nextChannel.name)
})

app.get('/prev', function(req, res) {
    changeIndex(false);
    let prevChannel = playlist[activeRadio]
    fifo.write("loadfile "+ prevChannel.url)
    res.send("Changes radio channel: \n now playing: " + prevChannel.name)
})

app.get('/')



 
fifo.setReader(text => {
    console.log(text);
})
 

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})