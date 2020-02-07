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
const msg2 = "NOT MATCHING RESULTS";

//CREATE ARTICLE
multimediaController.createArticle = (request, response) => {
  console.log("entro");
  const token = request.headers.authorization.replace("Bearer ", "");
  const { id } = jwt.verify(token, myPrivateKey);

  if (token) {
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
    connection.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        response.sendStatus(400);
      } else {
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
  const token = request.headers.authorization.replace("Bearer ", "");
  const { id } = jwt.verify(token, myPrivateKey);
  if (token) {
    const { title, category, type, description, path } = request.body;
    const price = request.body.price ? request.body.price : 0;
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

// GET ALL MULTIMEDIA FILES BY USER AND TYPE. 
//TODO IF/ELSE PARA QUE MUELSTRE TODOS LOS ARTÏCULOS
multimediaController.getMultimediaByUserAndType = (request, response) => {
  console.log("entraaaa")
  const { authorization } = request.headers;
  const { id } = request.params;
  const {type} = request.params;
  console.log(type)
  
  console.log("id" + id);
  if (authorization) {
    const token = request.headers.authorization.split(' ')[1];
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
    SELECT *
    FROM multimedia
    WHERE type = '${type}' AND id = '${id}'
    `,
      (error, results) => {
        if (error) {
          console.log(error);
          response.sendStatus(400);
        } else {
          response.send(results);
          console.log(results)
         
        }
      }
    );
  }
};

//OPEN SINGLE MULTIMEDIA
multimediaController.getOneMultimedia = (request, response) => {
  const { multimediaId } = request.params;
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

//SEARCH BOX
multimediaController.searchByWordMultimedia = (request, response) => {
  const { key } = request.body
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
      SELECT *
      FROM multimedia
      WHERE title LIKE "%${key}%" OR textArea LIKE "%${key}%" 
      ORDER BY time DESC
        `,
      (error, results) => {
        if (results && results.length > 0) {
          response.send(results);
          console
        } else {
          response.send(msg2);
        }

      }
    )
  }
    
};


//LIKE AN ARTICLE
multimediaController.likeMultimedia = (request, response) => {};

//DISLIKE AN ARTICLE
multimediaController.dislikeMultimedia = (request, response) => {};

module.exports = multimediaController;
