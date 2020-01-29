const express = require("express");
var logger = require("morgan");
var path = require("path");
const app = express();
const bodyParser = require("body-parser");

var cors = require("cors");
app.use(cors());

// Settings
app.set("port", 3000);

// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/users", require("./routes/users.js"));
app.use("/articles", require("./routes/articles.js"));

// Starting the server
app.listen(app.get("port"), () => {
  console.log("server working on", app.get("port"));
});

const connection = require('./config/db.js');
connection.connect(console.log("Conexión correcta"));
