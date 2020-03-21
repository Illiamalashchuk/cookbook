// here will be backend server settings
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// default route
app.get("/", function(req, res) {
  return res.send({ error: true, message: "hello" });
});
// connection configurations
var dbConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "november30",
  database: "cookbook"
});

// connect to database
dbConn.connect();

require("./routes")(app, dbConn);

// set port
app.listen(3000, function() {
  console.log("Node app is running on port 3000");
});

module.exports = app;
