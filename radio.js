var command  = process.argv[1]
console.log(command)
var fs = require('fs');
var file = "/tmp/mplayercontrol"
fs.write(file, command)
