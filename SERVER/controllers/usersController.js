// email: validator.validate(email) ? email : "not valid", //HERE THERE NEEDS TO GO AN ERROR

const usersController = {};

//Middleware
let sha1 = require("sha1");
let validator = require("email-validator");
let jwt = require("jsonwebtoken");
const connection = require("../config/db.js");

//CONSTANTS
const myPrivateKey = "mySecretKey";

//NEW USER REGISTER
usersController.createUser = (req, res) => {
  let { name, surname, email, password } = req.body;
  if (validator.validate(email) && name && surname && password) {
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
  } else {
    res.sendStatus(404);
  }
};

//LOGIN USER
usersController.login = (request, response) => {
  const { email, password } = request.body;
  connection.query(
    `SELECT * FROM users 
  WHERE email = '${email}' 
  AND password = sha1('${password}')`,
    (error, results) => {
      if (error) console.log("error");
      else if (results && results.length) {
        var [{ isAdmin, id }] = results;
        const token = jwt.sign(
          {
            id,
            email,
            isAdmin: Boolean(isAdmin)
          },
          myPrivateKey
        );
        response.send({
          token
        });
      } else {
        response.sendStatus(400);
      }
    }
  );
};

//GET ALL USERS
usersController.getUsers = (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    let sql = "SELECT id, name, email, isAdmin FROM users";
    connection.query(sql, (error, results) => {
      if (error) console.log(error);
      res.send(results);
    });
  } catch {
    res.sendStatus(401);
  }
};

//GET USER BY ID
usersController.getUser = (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const token = req.headers.authorization.replace("Bearer ", ""); //le quitas el Bearer que viene predeterminado
    console.log(token);
    jwt.verify(token, myPrivateKey);
    let sql = `SELECT id, name, email FROM users where id = ${id}`;
    connection.query(sql, (error, results) => {
      if (error) console.log(error);
      res.send(results[0]);
    });
  } catch {
    res.sendStatus(401);
  }
};

//EDIT USER
usersController.editUser = (request, response) => {
  const { id } = request.params;
  const password = sha1(request.body.password);
  const {
    name,
    surname,
    email,
    profession,
    about_me,
    avatar,
    facebook,
    linkedin,
    twitter,
    youtube
  } = request.body;

  try {
    const token = request.headers.authorization.replace("Bearer ", "");
    const { isAdmin } = jwt.verify(token, myPrivateKey);
    let sql = `UPDATE users SET? where id = ${id}`;
    if (isAdmin) {
      connection.query(
        sql,
        {
          password,
          name,
          surname,
          email,
          profession,
          about_me,
          avatar,
          facebook,
          linkedin,
          twitter,
          youtube
        },
        (error, results) => {
          if (error | (error == null)) console.log(error);
          console.log("actualizo por Admin");
          response.sendStatus(200);
        }
      );
    } else {
      connection.query(sql, { password }, (error, results) => {
        if (error | (error == null)) response.sendStatus(401);
        else {
          response.sendStatus(200);
        }
        console.log("me actualizo");
      });
    }
  } catch {
    response.sendStatus(401);
  }
};

//DELETE USER
usersController.deleteUser = (request, response) => {
  const { id } = request.params;
  try {
    const token = request.headers.authorization.replace("Bearer ", "");
    const { isAdmin } = jwt.verify(token, myPrivateKey);
    const { id: tokenId } = jwt.verify(token, myPrivateKey);
    console.log(tokenId);
    console.log(isAdmin);
    let sql = `DELETE FROM users WHERE id = ${id}`;
    if (isAdmin) {
      connection.query(sql, (error, results) => {
        console.log(error);
        if (error | (error == null)) response.sendStatus(404).end();
        else {
          response.sendStatus(200);
          console.log("Borro a cualquiera");
        }
      });
    } else if (tokenId == id) {
      //you can only delete yourself
      connection.query(sql, (error, results) => {
        if (error) console.log(error);
        else {
          response.sendStatus(200);
          console.log("te borro a ti mismo");
        }
      });
    } else {
      response.sendStatus(401);
      console.log("no te borro");
    }
  } catch {
    response.sendStatus(404);
  }
};

//SAVE / UNSAVE MULTIMEDIA
usersController.saveUnsaveMultimedia = (req, res) => {
  try {
    const { multimediaId } = req.body;
    const token = req.headers.authorization.replace("Bearer ", "");
    const {id} = jwt.verify(token, myPrivateKey);
    connection.query(
      `SELECT * FROM user_saved_multimedia
      WHERE id = ${id}
      AND multimediaId = ${multimediaId} `,
      (_, results) => {
         if (!results.length) {
          connection.query(
            `
            INSERT INTO user_saved_multimedia (id, multimediaId)
            VALUES('${id}','${multimediaId}')`,
            (err) => {
              if (err) {
                res.sendStatus(404);
              } else {
                res.sendStatus(200);
              }
            }
          );
        } else {
          connection.query(
            `DELETE FROM user_saves_multimedia
             WHERE  id = ${id} 
             AND multimediaId = ${multimediaId}`,
            (err, results) => {
              if (err) {
                res.sendStatus(404);
              } else {
                res.sendStatus(200);
              }
            }
          );
        }
      }
    );
  } catch {
    res.sendStatus(404);
  }
};

//FOLLOW USER
usersController.followUser = (req, res) => {};

//UNFOLLOW ANOTHER USER
usersController.unfollowUser = (req, res) => {};

module.exports = usersController;
