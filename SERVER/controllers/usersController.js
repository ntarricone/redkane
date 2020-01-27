// email: validator.validate(email) ? email : "not valid", //HERE THERE NEEDS TO GO AN ERROR

const usersController = {};

//Middleware
let sha1 = require("sha1");
let validator = require("email-validator");
let jwt = require("jsonwebtoken");
const connection = require("../config/db.js");

//CONSTANTS
const jwtKey = "mySecretKey";

//NEW USER REGISTER
usersController.createUser = (req, res) => {
  let {name, surname, email, password} = req.body;
  console.log(password)
  connection.query(
    `
    INSERT
    INTO users (name, surname, email, password)
    VALUES('${name}','${surname}', '${email}', sha1('${password}'))
  `,
    (err, results) => {
      if (err) {
        res.status(400).send("El usuario ya existe");
      } else {
        connection.query(
          `SELECT id, email FROM users WHERE email = '${email}'`,
          (err, [newUser]) => {
            //el newUser es results[0]
            res.send(newUser);
          }
        );
      }
    }
  );
};

//LOGIN USER
usersController.login = (req, res) => {
  const { email, password } = request.body;
  connection.query(
  `SELECT * FROM users 
  WHERE email = '${email}' 
  AND password = sha1('${password}')`,
    (error, results) => {
      if (error) console.log("error");
      else if (results && results.length) {
        var [{ isAdmin, id, avatar }] = results;
        const token = jwt.sign(
          {
            id,
            username,
            isAdmin: Boolean(isAdmin) //para que te tire un true or false
          },
          jwtKey
        );
        response.send({
          token,
          avatar
        });
      } else {
        response.sendStatus(400);
      }
    }
  );
};

//GET ALL USERS
usersController.getUsers = (req, res) => {
  let sql = "SELECT * FROM users";
  connection.query(sql, (error, results) => {
    if (error) console.log(error);
    res.send(results);
  });
};

//GET USER BY ID
usersController.getUser = (req, res) => {};

//EDIT USER
usersController.editUser = (req, res) => {};

//DELETE USER
usersController.deleteUser = (req, res) => {};

//SAVE ARTICLE
usersController.saveArticle = (req, res) => {};

//UNSAVE ARTICLE
usersController.unsaveArticle = (req, res) => {};

//FOLLOW USER
usersController.followUser = (req, res) => {};

//UNFOLLOW ANOTHER USER
usersController.unfollowUser = (req, res) => {};


module.exports = usersController;
