//the process users connect to with WebSockets to get content updates, streamer connects to different port
let cluster = require("cluster");
let process = require("process");

if (cluster.isMaster) {
process.send("started");
//TO TST for todo in stanceMAster
setTimeout(process.exit(1), 2000);

} else {

  require('uWebSockets.js').App().ws('/*', {

    /* For brevity we skip the other events */
    message: (ws, message, isBinary) => {
      let ok = ws.send(message, isBinary);
    }

  }).any('/*', (res, req) => {

    /* Let's deny all Http */
    res.end('HTTP unallowed');

  }).listen(9001, (listenSocket) => {

    if (listenSocket) {
      console.log('Listening to port 9001');
    }

  });
}
