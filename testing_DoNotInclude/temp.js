let uWS = require("uWebSockets.js");

let app = uWS.App();

setInterval(() => {app.publish("stream", "test")}, 3000);

app.ws('/*', {
  //options
  compression: 0,
  maxPayloadLength: 16 * 1024 * 1024,
  idleTimeout: 60,

  //handler on opened
  open: (ws, req) => {
    //authenticate as non-malicious use

    //listen to channel stream
    ws.subscribe('stream');
  }
}).any('/*', (res, req) => {

  //HTTP unallowed
  res.end('HTTP unallowed');

}).listen(8914, (listenSocket) => {

  if (listenSocket) {
    console.log('Listening to port 8914');

  }

});
