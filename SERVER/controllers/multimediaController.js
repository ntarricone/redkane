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

//CREATE MULTIMEDIA
multimediaController.createMultimedia = (request, response) => {
  console.log("entro");
  const token = request.headers.authorization.replace("Bearer ", "");
  const { id } = jwt.verify(token, myPrivateKey);
  
  if (token) {
    console.log(request.file.filename)
    const path = request.file.filename;
    const { title, category, type, textArea } = request.body;
    const price = request.body.price ? request.body.price : 0;
    // console.log(price)

    // const [language] = lngDetector.detect(textArea)
    const sql =  `
    INSERT
    INTO multimedia (path, title, type, category, price, textArea, language, id)
    VALUES('${path}', '${title}', '${type}', '${category}', '${price}', '${textArea}', 'english' ,${id});
  `
  console.log(sql)
    connection.query(sql, (error, results) => {
        if (error) {
          console.log(error);
          response.sendStatus(400);
        } else {
          console.log(results.insertId)
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
      }
    );
  }
};

//CREATE VIDEO
multimediaController.createVideo = (request, response) => {
  console.log("entro");
  const token = request.headers.authorization.replace("Bearer ", "");
  const { id } = jwt.verify(token, myPrivateKey);
  if (token) {
    const { title, category, type, textArea, path } = request.body;
    const price = request.body.price ? request.body.price : 0;
    console.log(request.body.title);
    connection.query(
      `
    INSERT
    INTO multimedia (path, title, type, category, price, textArea, id)
    VALUES('${path}', '${title}', '${type}', '${category}', '${price}', '${textArea}', ${id})
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

//CREATE ARTICLE
multimediaController.createEditor = (request, response) => {
  console.log("entro");
  
    const { title, category, type, textArea, path } = request.body;
    
    console.log(request.body.title);
    connection.query(
      `
    INSERT
    INTO editor (textArea)
    VALUES('${textArea}')
  `,
      error => {
        if (error) {
          console.log(error);
          response.sendStatus(400);
        }
      }
    )
    }

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
    console.log("entrudis")

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

//EDIT MULTIMEDIA.
// TODO MULTER
multimediaController.editMultimedia = (request, response) => {
  const { multimediaId } = request.params;
  const { path, title, type, price, category } = request.body;
  console.log(multimediaId);
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
    UPDATE 
    multimedia SET path ='${path}', title = '${title}', type = '${type}', price = '${price}', category = '${category}'
    WHERE multimediaId = '${multimediaId}'
    `,
      (error, results) => {
        if (error) {
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
