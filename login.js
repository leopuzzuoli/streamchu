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
      let result = database.query("SELECT * FROM streamers", con, (result) =>{
        console.log(result)
      })
  });

app.listen(8000, () => console.log("running"));
