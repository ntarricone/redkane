var mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password : "root",
    database: "redkane_web"
});

module.exports = connection; 