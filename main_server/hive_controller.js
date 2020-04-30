//create AWS EC2 instances, manage changes to them, monitor wasted resources
let database = require("./database.js");
let express = require("express");
let readline = require("readline");

let app = express();

//define app as using JSON
app.use(express.json());

//connect to database
let con = database.connect();

//set up for exit TODO: remove / rewrite completely to meet specifications
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on("close", function() {
  console.log("stopping service");
  con.end();
  process.exit(0);
});

//when stream is called, create new lobby
app.post("/stream", function(req, res, next) {
  let username = "";
  let sessid = "";
  //get credentials
  try {
    username = req.body.username;
    sessionID = req.body.sessid;
  } catch {
    //in case of error
    console.log("Bad request");
    res.writeHead(400, {
      "content-type": "text/html"
    });
    res.end("Bad request");
  }

  //check for clean input
  if (database.checkforcleaninput(username) && database.checkforcleaninput(sessionID)) {} else {
    res.writeHead(401, {
      "content-type": "text/html"
    });
    res.end("Bad Input");
    return;
  }

  //confirm credentials
  database.query(`SELECT * FROM stream_sessions WHERE streamer_session='${sessionID}';`, con).then((result) => {
    if (result.length === 1) {
      //if one result is found
      //get correct streamer_id
      database.query(`SELECT * FROM streamers WHERE username='${username}';`, con).then((result2) => {
        if (result2.length === 1) {
          //if usernames match
          if (result2[0].streamer_id === result[0].streamer_id) {
            //check if streamer has minutes remaining
            if (result2[0].minutes_remaining > 0) {
              //continue to next then with account data
              return [result2[0].max_viewers,result2[0].minutes_remaining];
            } else {
              //continue to next as no minutes remaining
              return 0;
            }
          }
        } else {
          //in case username is invalid
          res.writeHead(401, {
            "content-type": "text/html"
          });
          res.end("Invalid credentials");
          //continue to next then as false
          return false;
        }
      }).then((result) => {
        //if true user is valid, and has minutes remaining
        if(result.isArray()){
          //extract data from result
          let max_viewers = result[0];
          let minutes_remaining = result[1];

          //start creating lobby
          database.query(`SELECT * FROM resources WHERE max_viewers >= '${max_viewers}';`, con).then((server) => {
            //if no server is available
            if(server.length === 0){
              //create new EC2 instance
                  //i do not have a clue
              //get EC2 instance IP
               //same
              //get available resources
              //add to database

              //allocate resources
            }
            else{
              //grab the first available server and allocate resources
              allocRes(server[0].ip);
            }
          });

        }
        else if (result === 0){
          res.writeHead(401, {"content-type" : "text/html"});
          res.end("Account minutes depleted");
        }
        else{
          return;
        }
      });
    } else if (result > 1) {
      console.error("SERIOUS ERROR: more than 1 session ID user");
    } else {
      //in case sessionID is invalid
      res.writeHead(401, {
        "content-type": "text/html"
      });
      res.end("Invalid credentials");
    }
  }).catch((error) => console.log(error));
});


//allocate resources
function allocRes(IP){
  return new Promise(resolve, reject){
      
  }
}

app.post("/streamended", function(req, res) {
  //get credentials

  //validate credentials

  //update database

  //respond
});
app.listen(8002, () => console.log("running"));
