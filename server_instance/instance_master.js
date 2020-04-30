//controls and monitors the IC2 instance and assigns cores to stream_master processes to do their part.
const fork = require('child_process').fork;
const program = path.resolve('stream_master.js');
const numCPUs = require('os').cpus().length;
const express = require("express");

//array containing references to stream_master processes
lobbys = []

let app = expess()

//define app as using JSON
app.use(express.json())


//create child process
function createLobby(){
  const parameters = [];
  const options = {
    stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
  };
  lobbys.push(fork(program, parameters, options));
}
