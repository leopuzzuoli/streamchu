let cluster = require("cluster");
const path = require("path");
const fork = require('child_process').fork;
const program = path.resolve(".." ,"server_instance" ,'./stream.js');

let t_portpair = "s8913v8914";
let stream_size = 2;
let maximum_vw = 10000;

//send portpair, allocated CPU space and maximum conurrent conenction numbers to process
const parameters = [t_portpair, stream_size, maximum_vw];
const options = {
  stdio: ['pipe', 'pipe', 'pipe', 'ipc']
};
//fork the program
let lobbys = fork(program, parameters, options);
console.log(parameters);
//set message display on recieve
lobbys.on('message', (msg) => {
  if (msg === "started") {
    console.log("started");
  } else {
    console.log("msg: " + msg);
  }
});
//set message recieve on exit
lobbys.on('exit', (code, signal) => {
  if (signal) {
    console.log(`worker was killed by signal: ${signal}`);
  } else if (code !== 0) {
    console.log(`worker exited with error code: ${code}`);
  } else {
    console.log('worker success!');
  }
});
