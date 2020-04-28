require('uWebSockets.js').App().ws('/*', {

  /* For brevity we skip the other events */
  message: (ws, message, isBinary) => {
    let ok = ws.send(message, isBinary);
  }

}).any('/*', (res, req) => {

  /* Let's deny all Http */
  res.end('Nothing to see here!');

}).listen(9001, (listenSocket) => {

  if (listenSocket) {
    console.log('Listening to port 9001');
  }

});
