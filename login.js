let express = require("express")
let crypto = require("crypto")
let readline = require("readline");
let database = require("./database.js")

let app = express()

//define app as using JSON
app.use(express.json());

//connect to database
let con = database.connect();

//set up for exit
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("close", function() {
    console.log("stopping service");
    con.end()
    process.exit(0);
});

//precalculate date for cookie session expiry
let someDate = new Date();
let numberOfDaysToAdd = 6;
someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
let yyyy = someDate.getFullYear()
let mm = someDate.getMonth()
let dd = someDate.getDate()
let expiry_date = yyyy + "/" + mm + "/" + dd;

//on POST request
app.post('/', function(req, res){
  //grab login data
      let username = req.body.username;
      let password_unhashed = req.body.password;

      //clean input
      if(database.checkforcleaninput(username) && database.checkforcleaninput(password_unhashed)){} else{res.end("Bad Input")}

      //create password hasher
      let sha256hasher = crypto.createHash("sha256");
      //hash the password
      let password_hashed = sha256hasher.update(password_unhashed).digest("hex");

  //check if login data is correct
      database.query(`SELECT * FROM streamers WHERE username='${username}' AND password_hash='${password_hashed}';`, con, (result) =>{

        if(result.length === 1){
          //if it is correct grab user_id
          let streamer_id = result[0].streamer_id

          //create session_cookie and pass it to the user
          generateCookie((n_cookie) =>{
            console.log("NCOOK: " + n_cookie);
            database.query(`INSERT INTO stream_sessions (streamer_session, session_invalid_after, streamer_id) VALUES ('${n_cookie}', '${expiry_date}', '${streamer_id}')`, con, (result2) =>{
              console.log(result2);
              res.writeHead(200,{"content-type" : "text/html"});
              res.end(n_cookie);
            });
          });

        }
        else if(result.length > 1){
          //if something went horribly wrong - TODO: Properly report
          console.log("WARNING: CRITICAL ERROR " + result)
          res.writeHead(401,{"content-type" : "text/html"});
          res.end("Invalid credentials");
        }
        else{
          //in case username and password are wrong
          res.writeHead(401,{"content-type" : "text/html"});
          res.end("Invalid credentials");
        }
      });
  });

let i = 0;
function generateCookie(callback){
  let new_sess_cookie = crypto.randomBytes(16).toString('hex');
  console.log("SC: " + new_sess_cookie);
  //check if cookie already exists
  database.query(`SELECT * FROM stream_sessions WHERE streamer_session='${new_sess_cookie}';`, con, (result3) =>{
    //if no cookie is already found return it
    if(result3.length === 0){
        i = 0;
        console.log("return");
        return callback(new_sess_cookie);
    }
    else{
      if(i > 10){
        console.log("fatal error in cookie generation");
      }
      else{
      generateCookie(callback);
      //TODO : to be tested
      i++;
    }
    }
  });
}

app.listen(8000, () => console.log("running"));
