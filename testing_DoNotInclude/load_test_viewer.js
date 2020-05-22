#!/usr/bin/env node
let cache = require("node-cache");
const myCache = new cache();

let CONCURRENT_CONNECTIONS = 5000;
let VIEWERS_PER_SECOND = 10;

var WebSocketClient = require('websocket').client;

function User(name) {
  return {
    connect: function() {
      return new Promise((resolve, reject) => {
        let completed = false;

        var client = new WebSocketClient();

        client.on('connectFailed', function(error) {
          console.log('Connect Error: ' + error.toString());
          reject();
        });

        client.on('connect', function(connection) {
          connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
            reject();
          });
          connection.on('close', function() {
            reject();
          });
          setTimeout(() => {
            connection.close();
            reject();
          }, 20000);
          let i = 0;
          connection.on('message', function(message) {
            i++;
            if (i > 2) {
              connection.close();
              resolve(true);
            }
          });
        });

        client.connect('ws://localhost:8914/', 'echo-protocol');
      });
    }
  };
}
myCache.set("successful", 0);
myCache.set("errors", 0);
for (let i = 0; i < CONCURRENT_CONNECTIONS; i++) {
  let usr = new User();
  usr.connect().then(() => {
    console.log("returned");
    successful++;
  }).catch(() => {
    console.log("returned");
    errors++;
  })
}
setTimeout(() => {
  console.log("successful: " + successful);
  console.log("unsuccessful: " + errors);
}, 21000);
