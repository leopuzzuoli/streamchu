#!/usr/bin/env node

var WebSocketClient = require('websocket').client;

function Streamer(name) {
  return {
    connect: function() {
      return new Promise((resolve, reject) => {

        var client = new WebSocketClient();

        client.on('connectFailed', function(error) {
          console.log('Connect Error: ' + error.toString());
        });

        client.on('connect', function(connection) {
          connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
          });
          connection.on('close', function() {
            console.log('echo-protocol Connection Closed');
            process.exit(1);
          });
          let i = 0;
          let interval = setInterval(() => {
            if (i >= 3) {
              console.log("clearing interval");
              clearInterval(interval);
              connection.close();
              resolve();
            } else {
              console.log("sending");
              connection.send('{"type" : "Spotify", "sessid" : "00000000"}');
              i++;
            }
          }, 3000);
        });

        client.connect('ws://127.0.0.1:8913?token=00050ab05fdd2f6488bf1ecacb2b233f', 'echo-protocol');
      });
    }
  };
}
let str = new Streamer();
str.connect();
