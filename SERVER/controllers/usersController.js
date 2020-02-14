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
  let defaultValue = "";
  if (validator.validate(email) && name && surname && password) {
    connection.query(
      `
    INSERT
    INTO users (name, surname, email, password, isAdmin, avatar,
       profession, about_me, linkedin, youtube, banner)
    VALUES('${name}','${surname}', '${email}', sha1('${password}'),
     0, '${defaultValue}','${defaultValue}', '${defaultValue}', '${defaultValue}',
      '${defaultValue}', '${defaultValue}')
  `,
      (err, results) => {
        if (err) {
          console.log(err);
          console.log("entri");
          res.status(400).send("El usuario ya existe");
        } else {
          connection.query(
            `SELECT * FROM users 
          WHERE email = '${email}' 
          AND password = sha1('${password}')`,
            (error, results) => {
              if (error) console.log("error");
              else if (results && results.length) {
                var [
                  {
                    id,
                    name,
                    surname,
                    email,
                    isAdmin,
                    avatar,
                    profession,
                    about_me,
                    linkedin,
                    youtube,
                    banner,
                    isCreator
                  }
                ] = results;
                const token = jwt.sign(
                  {
                    id,
                    email,
                    isAdmin: Boolean(isAdmin)
                  },
                  myPrivateKey
                );

                res.send({
                  token,
                  id,
                  name,
                  surname,
                  email,
                  isAdmin,
                  avatar,
                  profession,
                  about_me,
                  linkedin,
                  youtube,
                  banner,
                  isCreator: Boolean(isCreator)
                });
              } else {
                res.sendStatus(400);
              }
            }
          );
        }
      }
    );
  } else {
    res.sendStatus(404);
  }
};

//LOGIN USER - TODO insert last login date
usersController.login = (request, response) => {
  const { email, password } = request.body;
  connection.query(
    `SELECT * FROM users 
  WHERE email = '${email}' 
  AND password = sha1('${password}')`,
    (error, results) => {
      if (error) console.log("error");
      else if (results && results.length) {
        var [
          {
            isAdmin,
            id,
            avatar,
            banner,
            surname,
            profession,
            about_me,
            name,
            youtube,
            linkedin,
            isCreator
          }
        ] = results;
        const token = jwt.sign(
          {
            id,
            email,
            isAdmin: Boolean(isAdmin)
          },
          myPrivateKey
        );
        response.send({
          token,
          avatar,
          banner,
          surname,
          profession,
          about_me,
          name,
          youtube,
          linkedin,
          isCreator: Boolean(isCreator)
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
      console.log(results);
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
    let sql = `SELECT * FROM users where id = ${id}`;
    connection.query(sql, (error, results) => {
      if (error) console.log(error);
      res.send(results[0]);
    });
  } catch {
    res.sendStatus(401);
  }
};

//EDIT PASSWORD // TODO -  NOT WORKING
usersController.editPassword = (req, res) => {
  const { id } = req.params;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  console.log(newPassword);
  console.log(oldPassword);
  try {
    if (oldPassword && newPassword) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const { isAdmin } = jwt.verify(token, myPrivateKey);
      let sql = `SELECT * FROM users 
                 WHERE id = ${id} 
                 AND password = SHA1('${oldPassword}')`;
      let sql2 = `UPDATE users
                SET password = SHA1('${newPassword}')
                WHERE id = ${id}`;
      if (isAdmin) {
        connection.query(sql2, (error, results) => {
          if (error) {
            res.sendStatus(404);
          } else {
            console.log("actualizo como admin");
            res.send(results);
          }
        });
      } else {
        connection.query(sql, (error, results) => {
          console.log(results);
          if (error) {
            console.log("entro");
            console.log(error);
            res.sendStatus(404);
          } else if (results && results.length) {
            this.updatePassword(id);
            console.log("entru");
            connection.query(sql2, (error, results) => {
              if (error) {
                res.sendStatus(401);
                console.log("eroooorcito");
              } else {
                res.send(results);
                console.log("actualizo como user");
              }
            });
          }
        });
      }
    }
  } catch {
    res.sendStatus(401);
  }
};

//EDIT USER

usersController.editUser = (request, response) => {
  const { id } = request.params;

  const {
    name,
    surname,
    profession,
    about_me,
    facebook,
    linkedin,
    twitter,
    youtube
  } = request.body;

  const token = request.headers.authorization.replace("Bearer ", "");
  const { isAdmin } = jwt.verify(token, myPrivateKey);
  let sql = `UPDATE users
    SET name = '${name}',
    surname = '${surname}',
    profession = '${profession}',
    about_me = '${about_me}',
    facebook = '${facebook}',
    linkedin = '${linkedin}',
    twitter = '${twitter}',
    youtube = '${youtube}'
    WHERE id = '${id}'`;
  console.log(sql);
  let sql2 = `SELECT * FROM users
                WHERE id = ${id}`;

  connection.query(sql, (error, results) => {
    if (error) {
      console.log(error);
      response.sendStatus(404);
    } else {
      connection.query(sql2, (error, results) => {
        if (error) {
          response.sendStatus(401);
        } else {
          delete results[0].password; //deleting password from response
          response.send(results[0]);
          console.log("me actualizo");
        }
      });
    }
  });
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

//LIKE / DISLIKE MULTIMEDIA
usersController.likeDislike = (req, res) => {
  try {
    console.log("entroooooooo");
    const token = req.headers.authorization.replace("Bearer ", "");
    console.log(token);
    const { id } = jwt.verify(token, myPrivateKey);
    const { multimediaId } = req.params;
    console.log(multimediaId);
    let likeStatus = true;
    connection.query(
      `SELECT * FROM user_liked_multimedia
      WHERE id = ${id}
      AND multimediaId = ${multimediaId} `,
      (_, results) => {
        console.log(results);
        if (!results.length) {
          console.log("no hay results" + results);

          connection.query(
            `
            INSERT INTO user_liked_multimedia (id, multimediaId)
            VALUES('${id}','${multimediaId}')`,
            err => {
              if (err) {
                console.log(err);
                res.sendStatus(404);
              } else {
                res.send(likeStatus);
              }
            }
          );
        } else {
          likeStatus = false;
          connection.query(
            `DELETE FROM user_liked_multimedia
             WHERE  id = ${id} 
             AND multimediaId = ${multimediaId}`,
            (err, results) => {
              if (err) {
                console.log(err);

                res.sendStatus(404);
              } else {
                res.send(likeStatus);
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

//GET LIKED STATUS - gets liked status +  amount of liked sent back in a json
usersController.getLikeStatus = (request, response) => {
  const { multimediaId } = request.params;
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    const { id } = jwt.verify(token, myPrivateKey);
    connection.query(
      `SELECT * FROM user_liked_multimedia
      WHERE id = ${id}
      AND multimediaId = ${multimediaId} `,
      (error, liked) => {
        connection.query(
          `SELECT COUNT(*)
          FROM user_liked_multimedia
          WHERE multimediaId = ${multimediaId}`,
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              console.log("nostraentramus");
              console.log(liked.length);
              console.log(Boolean(liked.length));
              console.log(results[0]["COUNT(*)"]);
              response.send({
                isLiked: Boolean(liked.length),
                likes: results[0]["COUNT(*)"]
              });
            }
          }
        );
      }
    );
  }
};

//UPLOAD BANNER
usersController.uploadBanner = (req, response) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { id } = jwt.verify(token, myPrivateKey);
    const banner = req.file.filename;
    connection.query(
      `UPDATE users
       SET banner = '${banner}'
       WHERE id = ${id}`,
      err => {
        if (err) {
          response.sendStatus(400);
        } else {
          connection.query(
            `SELECT banner
             FROM users 
             WHERE id = ${id}`,
            (err, [results]) => {
              err ? console.log(err) : response.send(results);
            }
          );
        }
      }
    );
  }
};

//UPLOAD AVATAR
usersController.uploadAvatar = (req, response) => {
  console.log("entroooooo");
  const { authorization } = req.headers;
  if (authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { id } = jwt.verify(token, myPrivateKey);
    const avatar = req.file.filename;
    connection.query(
      `UPDATE users
       SET avatar = '${avatar}'
       WHERE id = ${id}`,
      err => {
        if (err) {
          response.sendStatus(400);
        } else {
          connection.query(
            `SELECT avatar
             FROM users 
             WHERE id = ${id}`,
            (err, [results]) => {
              err ? console.log(err) : response.send(results);
            }
          );
        }
      }
    );
  }
};

//UPDATE TO BE CREATOR
usersController.confirmCreator = (request, response) => {
  console.log("entroooooo");
  const { id } = request.params;
  connection.query(
    `UPDATE users
       SET isCreator = 1
       WHERE id = ${id}`,
    (err, results) => {
      let aux = false;
      if (err) {
        console.log(err);
        response.send(aux);
      } else {
        aux = true;
        response.send(aux);
      }
    }
  );
};

//UPDATE SOCIAL MEDIA
usersController.updateSocialMedia = (request, response) => {
  const { id } = request.params;
  const { youtube, linkedin } = request.body;
  connection.query(
    `UPDATE users
       SET youtube = '${youtube}',
       linkedin = '${linkedin}'
       WHERE id = ${id}`,
    (err, results) => {
      let aux = false;
      if (err) {
        console.log(err);
        response.send(aux);
      } else {
        aux = true;
        response.send(aux);
      }
    }
  );
};

//FOLLOW USER
usersController.followUser = (req, res) => {};

//UNFOLLOW ANOTHER USER
usersController.unfollowUser = (req, res) => {};

module.exports = usersController;
