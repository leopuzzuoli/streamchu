let mysql = require("mysql")

module.exports.query = (query, con) => {
  return new Promise((resolve, reject) => {
    //requires and execute query
    con.query(query, function(err, result, fields) {
      if (err) reject(err);
      //return query results
      resolve(result);
    });
  });
}

module.exports.connect = () => {
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'backend',
    password: '!attention3L',
    database: 'nocostream'
  });
  //if connection fails
  connection.on('error', function() {
    console.log("ERROR")
  });
  //connect to database with pre-made settigns
  connection.connect();
  //return the connection variable to the controller
  return connection
}

module.exports.checkforcleaninput = (str) => {
  const regex = /^[a-zA-Z0-9]+$/g;
  let found = str.match(regex);

  if (found !== null && found.length === 1) {
    if (found[0] === str) {
      return true;
    }
  }

  return false;

}
