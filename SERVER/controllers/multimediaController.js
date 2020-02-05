const multimediaController = {};

//middlewares
const readingTime = require("reading-time");
const jwt = require("jsonwebtoken");
const connection = require("../config/db.js");
const multer = require("multer");
const LanguageDetect = require("languagedetect");
const lngDetector = new LanguageDetect();

//constants
const myPrivateKey = "mySecretKey";
const msg = "REQUIRED FILE IS MISSING";

//CREATE ARTICLE
multimediaController.createArticle = (request, response) => {
  console.log("entro");
  const token = request.headers.authorization.replace("Bearer ", "");
  const { id } = jwt.verify(token, myPrivateKey);

  if (token) {
    console.log(request.file.filename);
    const path = request.file.filename;
    const { title, category, type, textArea, description } = request.body;
    const price = request.body.price ? request.body.price : 0;
    // console.log(price)

    const [language] = lngDetector.detect(description);
    const sql = `
    INSERT
    INTO multimedia (path, title, type, category, price, textArea, description, language, id)
    VALUES('${path}', '${title}', '${type}', '${category}',
     '${price}', '${textArea}','${description}', '${language}' ,${id});
  `;
    console.log(sql);
    connection.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        response.sendStatus(400);
      } else {
        console.log(results.insertId);
        connection.query(
          `
            SELECT *
            FROM multimedia
            WHERE multimediaId = '${results.insertId}'
          `,
          (error, results) => {
            if (error) {
              console.log(error);
              response.sendStatus(400);
            } else {
              const [file] = results;
              response.send(file);
            }
          }
        );
      }
    });
  }
};

//CREATE IMAGE

multimediaController.createImage = (request, response) => {
  console.log("entro");
  const token = request.headers.authorization.replace("Bearer ", "");
  const { id } = jwt.verify(token, myPrivateKey);

  if (token) {
    console.log(request.file.filename);
    const path = request.file.filename;
    const { title, category, type, description } = request.body;
    const price = request.body.price ? request.body.price : 0;
    // console.log(price)

    const [language] = lngDetector.detect(description);
    const sql = `
    INSERT
    INTO multimedia (path, title, type, category, price, description, language, id)
    VALUES('${path}', '${title}', '${type}', '${category}', '${price}',
     '${description}', '${language}' ,${id});
  `;
    console.log(sql);
    connection.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        response.sendStatus(400);
      } else {
        console.log(results.insertId);
        connection.query(
          `
            SELECT *
            FROM multimedia
            WHERE multimediaId = '${id}'
          `,
          (error, results) => {
            if (error) {
              console.log(error);
              response.sendStatus(400);
            } else {
              const [file] = results;
              response.send(file);
            }
          }
        );
      }
    });
  }
};

//CREATE VIDEO
multimediaController.createVideo = (request, response) => {
  console.log("entro");
  const token = request.headers.authorization.replace("Bearer ", "");
  const { id } = jwt.verify(token, myPrivateKey);
  if (token) {
    const { title, category, type, description, path } = request.body;
    const price = request.body.price ? request.body.price : 0;
    console.log(request.body.title);
    const [language] = lngDetector.detect(description);
    connection.query(
      `
    INSERT
    INTO multimedia (path, title, type, category, price, description, language, id)
    VALUES('${path}', '${title}', '${type}', '${category}', '${price}',
    '${description}', '${language}', ${id})
  `,
      error => {
        if (error) {
          console.log(error);
          response.sendStatus(400);
        } else {
          connection.query(
            `
            SELECT *
            FROM multimedia
            WHERE path = '${path}'
          `,
            (error, results) => {
              if (error) {
                console.log(error);
                response.sendStatus(400);
              } else {
                const [file] = results;
                response.send(file);
              }
            }
          );
        }
      }
    );
  }
};



//GET ALL MULTIMEDIA
multimediaController.getMultimedia = (request, response) => {
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
        SELECT *
        FROM multimedia
        `,
      (error, results) => {
        if (error) {
          console.log(error);
          response.sendStatus(400);
        } else {
          response.send(results);
        }
      }
    );
  }
};

//GET ALL MULTIMEDIA FILES BY TYPE
multimediaController.getMultimediaByType = (request, response) => {
  const { authorization } = request.headers;
  const { type } = request.params;
  console.log(type);
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
        SELECT *
        FROM multimedia WHERE type = '${type}'
        `,
      (error, results) => {
        if (error) {
          console.log(error);
          response.sendStatus(400);
        } else {
          response.send(results);
        }
      }
    );
  }
};

// GET ALL MULTIMEDIA FILES BY USER AND TYPE. ID FROM PARAMS!
multimediaController.getMultimediaByUserAndType = (request, response) => {
  const { id } = request.params;
  const { type } = request.body;
  const { authorization } = request.headers;
  console.log("id" + id);
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
    SELECT *
    FROM multimedia
    WHERE type = '${type}' AND id = '${id}'
    `,
      (error, [results]) => {
        if (error) {
          console.log(error);
          response.sendStatus(400);
        } else {
          response.send(results);
        }
      }
    );
  }
};

//OPEN SINGLE MULTIMEDIA
multimediaController.getOneMultimedia = (request, response) => {
  const { multimediaId } = request.params;
  console.log(multimediaId);
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
    SELECT *
    FROM multimedia
    WHERE multimediaId = '${multimediaId}'
    `,
      (error, results) => {
        if (results && results.length > 0) {
          response.send(results[0]);
        } else {
          response.send(msg);
        }
      }
    );
  }
};

//Update Article.

multimediaController.updateArticle = (request, response) => {
  const { multimediaId } = request.params;
  const { title, category, description } = request.body;
  let path = "";
  if (request.file){
     path = request.file.filename
  }else{
     path = request.body.path;
  }
  const textArea = request.body.textArea? request.body.textArea: "";
  const price = request.body.price ? request.body.price : 0;
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
    UPDATE 
    multimedia SET path ='${path}', title = '${title}',
    textArea = '${textArea}',
    price = '${price}', category = '${category}',
    description = '${description}'
    WHERE multimediaId = '${multimediaId}'
    `,
      (error, results) => {
        if (error) {
          console.log(error)
          return response.sendStatus(400);
        } else {
          connection.query(
            `
            SELECT *
            FROM multimedia
            WHERE multimediaId = '${multimediaId}'
          `,
            (error, results) => {
              if (error) {
                console.log(error);
                response.sendStatus(400);
              } else {
                const [multimedia] = results;
                response.send(results[0]);
                console.log(multimedia);
              }
            }
          );
        }
      }
    );
  }
};

//DELETE ARTICLE
multimediaController.deleteMultimedia = (request, response) => {
  const { multimediaId } = request.params;
  const { isDeleted } = request.body;
  console.log(multimediaId);
  const { authorization } = request.headers;
  const token = authorization.replace("Bearer ", "");
  const { isAdmin } = jwt.verify(token, myPrivateKey);
  jwt.verify(token, myPrivateKey);
  if (authorization | isAdmin) {
    connection.query(
      `
    UPDATE 
    multimedia SET isDeleted = ${isDeleted}
    WHERE multimediaId = '${multimediaId}'
    `,
      (error, results) => {
        if (error) {
          return response.sendStatus(400);
        } else {
          response.sendStatus(200);
        }
      }
    );
  }
};

//ARTICLES LIKED BY AN USER
multimediaController.getMultimediaLikedByUser = (request, response) => {};

//LIKE AN ARTICLE
multimediaController.likeMultimedia = (request, response) => {};

//DISLIKE AN ARTICLE
multimediaController.dislikeMultimedia = (request, response) => {};

module.exports = multimediaController;
