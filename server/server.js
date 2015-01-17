var socket = require('engine.io-client')('ws://localhost');
var http = require('http');

server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('');
}).listen(3000, '127.0.0.1');

socket.on('open', function(){
  socket.on('message', function(data){
  	socket.emit("chunk", {data: data})
  });
  socket.on('close', function(){});
});

console.log('Server running at http://127.0.0.1:8080/');
