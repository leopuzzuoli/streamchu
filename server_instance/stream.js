//the process users connect to with WebSockets to get content updates, streamer connects to different port
let cluster = require("cluster");
let process = require("process");

let viewerport = process.argv[0].split("v")[1];
let streamerport = (process.argv[0].split("s")[1]).split("v")[0];

process.send(process.argv);

process.send(streamerport);
process.send(viewerport);

//IF MASTER
if (cluster.isMaster) {
  process.send("test started");
  //---handlers---

  //if sub_worker crashes or exits successfully handler
  Object.values(cluster.workers).forEach(worker => {
    //on exit
    worker.on("exit", (code, signal) => {
      if (signal) {
        console.log(`worker was killed by signal: ${signal}`);
      } else if (code !== 0) {
        process.send(`stream sub_worker exited with error code: ${code}`);
        //create new sub_process immediately if exited unsuccessfully
        cluster.fork();
      } else {
        console.log("worker success");
      }
    });
  });
  process.send("test started");
  //if master crashes or exits successfully handler
  process.on("exit", (code) => {
    //if exit meant
    if (code === 0) {
      try {
        //exit each worker
        Object.values(cluster.workers).forEach(worker => {
          worker.send("close");
        });
      } catch {

      }
    } else {
      //do not kick off viewers and create instant new stream master
    }
  });
  process.send("test started");
  //on message from parent
  process.on("message", (msg) => {
    //if requested to close / exit
    if (msg === "close") {
      //calls process.exit which closes all child_processes
      process.exit(0);
    }
  });
  process.send("test started");
  //--- fork sub_processes ---

  //--- start server for streamer ---
  require("uWebSockets.js").App().ws("/*", {
    //get message
    message: (ws, message, isBinary) => {
      let ok = ws.send("200", isBinary);

      //if message signals to close the stream from the streamer
      if (message === "endStream") {
        process.send("end stream request");
      }


    }

    //listen on streamerport
  }).listen(streamerport, (listenSocket) => {
    if (listenSocket) {
      console.log("success");
      process.send("started");
    }else{
        process.send("test started5: " + streamerport);
        process.send(listenSocket);
    }
  });

  //TO TST for todo in stanceMAster

  //IF NOT MASTER
} else {

  process.on("message", (msg) => {
    if (msg === "close") {
      process.exit(0);
    }
  });

  require('uWebSockets.js').App().ws('/*', {
    //options
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 10,

    //handler on opened
    open: (ws, req) => {
      //listen to channel stream
      ws.subscribe('stream');
    }
  }).any('/*', (res, req) => {

    //HTTP unallowed
    res.end('HTTP unallowed');

  }).listen(9001, (listenSocket) => {

    if (listenSocket) {
      console.log('Listening to port 9001');
    }

  });
}
