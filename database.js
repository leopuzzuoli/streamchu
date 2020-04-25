let mysql = require("mysql")

module.exports.query = (query, con, callback) => {
  //requires and execute query
  con.query(query, function (err, result, fields) {
    if (err) throw err;
    //return query results
    return callback(result)
  });
}

module.exports.connect = () => {
  connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'backend',
          password : '!attention3L',
          database : 'nocostream'
      });
      //if connection fails
      connection.on('error', function() {console.log("ERROR")});
      //connect to database with pre-made settigns
      connection.connect();
      //return the connection variable to the controller
      return connection
}

module.exports.checkforcleaninput = (str) =>{
  let unallowed = []
  return true;
}
