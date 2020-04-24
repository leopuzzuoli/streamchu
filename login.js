let express = require("express")
let crypto = require("crypto")
let app = express()

//define app as using JSON
app.use(express.json());

//on POST request
app.post('/', function(req, res){
      let username = req.body.username;
      let password_unhashed = req.body.password;

      //create password hasher
      let sha256hasher = crypto.createHash("sha256");
      //hash the password
      let password_hashed = sha256hasher.update(password_unhashed).digest("hex");

      console.log(password_hashed)
  });

app.listen(8000, () => console.log("running"));
