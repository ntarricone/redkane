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
    const { title, type, description } = request.body;
    const price = request.body.price ? request.body.price : 0;
    // console.log(price)
    const category = request.body.category? request.body.category : "other";
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
        console.log(results.insertId);
        const {insertId} = results;
        connection.query(
          `
            SELECT *
            FROM multimedia
            WHERE multimediaId = '${insertId}'
          `,
          (error, results) => {
            if (error) {
              console.log(error);
              response.sendStatus(400);
            } else {
              console.log(results)
              const [file] = results;
              console.log(file)
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
      (error, results) => {
        if (error) {
          console.log(error);
          response.sendStatus(400);
        } else {
          const {insertId} = results;
          connection.query(
            `
            SELECT *
            FROM multimedia
            WHERE multimediaId = '${insertId}'
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



//GET ALL MULTIMEDIA EXCEPT REDKANELIVE CONTENT
multimediaController.getMultimedia = (request, response) => {
  console.log("entrokkk")
  console.log(request.body.counter)
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
      SELECT *
      FROM multimedia WHERE category != 'redkaneLive'
      ORDER BY time
      DESC
      LIMIT 6;
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

//GET MORE ALL MULTIMEDIA
multimediaController.getMoreMultimedia = (request, response) => {
  console.log("entrokkk")
  console.log(request.body.counter)
  const { authorization } = request.headers;
  const {counter} = request.body;
  let {type} = request.body;
  type = type === ""? type: `type = '${type}' AND`;
  console.log(type)
  console.log(type)
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
      SELECT *
      FROM multimedia WHERE ${type} category != 'redkaneLive'
      ORDER BY time
      DESC
      LIMIT ${counter};
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

//GET ALL MULTIMEDIA FILES BY TYPE EXCEPT REDKANELIVE CONTENT
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
        AND category != 'redkaneLive'
        ORDER BY time
        DESC
        LIMIT 6
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
  let {type} = request.body;
  console.log(type)
  type = type === ""? type : `type = '${type}' AND`
  console.log(type)
  
  console.log("id" + id);
  if (authorization) {
    const token = request.headers.authorization.split(' ')[1];
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
    SELECT *
    FROM multimedia
    WHERE ${type} id = ${id}
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
  console.log("entro")
  const { multimediaId } = request.params;
  console.log(multimediaId);
  const { authorization } = request.headers;
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, myPrivateKey);
  if (authorization) {
    connection.query(
      `
      DELETE FROM multimedia WHERE multimediaId=${multimediaId};
    `,
      (error) => {
        let aux = null;
        if (error) {
          aux = false;
          console.log(error)
          return response.send(aux);
        } else {
          aux = true;
          console.log(aux)
          response.send(aux);
        }
      }
    );
  }
};

//SEARCH BOX
multimediaController.searchMultimediaByWord = (request, response) => {
  const { key } = request.body
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
      SELECT *
      FROM multimedia, users
      WHERE (multimedia.id = users.id) AND ( 
       (title LIKE "%${key}%" OR textArea LIKE "%${key}%" OR name LIKE "%${key}%") AND category != 'redkaneLive')
      ORDER BY time DESC;
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

//SEARCH BOX BY USER ID
multimediaController.searchMultimediaByWordAndUser = (request, response) => {
  const { key } = request.body;
  const { id: idUser } = request.params;
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
      SELECT *
      FROM multimedia
      WHERE id = ${idUser}
      AND (title LIKE "%${key}%" OR textArea LIKE "%${key}%")
      ORDER BY time DESC
        `,
      (error, results) => {
        if (results && results.length > 0) {
          response.send(results);

        } else {
          response.send(msg2);
        }

      }
    )
  }
    
};


//GET MULTIMEDIA BY PRICE
// multimediaController.getMultimediaByPrice = (request, response) => {
//   const { authorization } = request.headers;
//   const { price } = request.params; 
//   if (authorization) {
//     const token = authorization.replace("Bearer ", "");
//     jwt.verify(token, myPrivateKey);
//     connection.query(
//       `
//         SELECT *
//         FROM multimedia WHERE price = ${price}
//         ORDER BY time
//         DESC
//         `,
//       (error, results) => {
//         if (error) {
//           console.log(error);
//           response.sendStatus(400);
//         } else {
//           response.send(results);
          
//         }
//       }
//     );
//   }
// };

//GET MULTIMEDIA BY PRICE
multimediaController.getMultimediaByPrice = (request, response) => {
  const { authorization } = request.headers;
  const { price } = request.params; 
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
        SELECT *
        FROM multimedia WHERE price = ${price} 
        AND category != 'redkaneLive'
        ORDER BY time
        DESC
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

//GET MULTIMEDIA BY PRICE AND USER
multimediaController.getMultimediaByPriceAndUser = (request, response) => {
  const { authorization } = request.headers;
  const { price, id } = request.params; 
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
        SELECT *
        FROM multimedia WHERE price = ${price} AND category != 'redkaneLive'
        AND id = ${id}
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

//GET CATEGORIES BY TYPE
multimediaController.getMultimediaCategories = (request, response) => {
  const { authorization } = request.headers;
  const { category } = request.params;
  let {type} = request.body;
  console.log(type)
 if(type === ""){
    type = ""
  }
  else if (type === "article" || "image" || "video"){
    type = `AND type = '${type}'`
    console.log(type)
  }
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
        SELECT *
        FROM multimedia WHERE category = '${category}'
        ${type}
        ORDER BY time
        DESC
        `,
      (error, results) => {
        console.log(results)
        if (results && results.length > 0) {
          response.send(results);
        } else {
          response.send(msg2);
        }
      }
    );
  }
}


//GET CATEGORIES WHEN FREE
multimediaController.getByFreeAndCategory = (request, response) => {
  const { authorization } = request.headers;
  const { category } = request.params;
 if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
        SELECT *
        FROM multimedia WHERE category = '${category}'
        AND price = 0
        ORDER BY time
        DESC
        `,
      (error, results) => {
        console.log(results)
        if (results && results.length > 0) {
          response.send(results);
        } else {
          response.send(msg2);
        }
      }
    );
  }
}

//GET CATEGORIES BY USER
multimediaController.getMultimediaCategoriesAndUser = (request, response) => {
  const { authorization } = request.headers;
  const { category, id } = request.params;
  let {type} = request.body;
  console.log(type)
 if(type === ""){
    type = ""
  }
  else if (type === "article" || "image" || "video"){
    type = `AND type = '${type}'`
    console.log(type)
  } 
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
        SELECT *
        FROM multimedia WHERE id = ${id} 
        AND (category = '${category}'
        ${type})
        `,
      (error, results) => {
        if (results && results.length > 0) {
          response.send(results)
        } else {
          response.send(msg2);
        }
      }
    );
  }
}

//GET ALL REDKANELIVE MULTIMEDIA CONTENT
multimediaController.getRedkaneLiveMultimedia = (request, response) => {
  const { authorization } = request.headers;
  let {type} = request.body;
  console.log(type)
 if(type === ""){
    type = ""
  }
  else if (type === "article" || "image" || "video"){
    type = `AND type = '${type}'`
    console.log(type)
  } 
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
      SELECT *
      FROM multimedia WHERE category = 'redkaneLive'
      ${type}
      ORDER BY time
      DESC
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

//GET ALL REDKANELIVE MULTIMEDIA CONTENT BY TYPE
multimediaController.getRedkaneLiveMultimediaByType = (request, response) => {
  const { authorization } = request.headers;
  const { type } = request.params;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
        SELECT *
        FROM multimedia WHERE type = '${type}'
        AND category = 'redkaneLive'
        ORDER BY time
        DESC
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

//SEARCH BOX. REDKANELIVE
multimediaController.searchMultimediaRedkaneLive = (request, response) => {
  const { key } = request.body;
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
      SELECT *
      FROM multimedia
      WHERE category = 'redkaneLive'
      AND (title LIKE "%${key}%" OR textArea LIKE "%${key}%")
      ORDER BY time DESC
        `,
      (error, results) => {
        if (results && results.length > 0) {
          response.send(results);

        } else {
          response.send(msg2);
        }

      }
    )
  }
    
};

//DISLIKE AN ARTICLE
multimediaController.dislikeMultimedia = (request, response) => {};

//ADD PURCHASE
multimediaController.addPurchase = (request, response) => {
  console.log("entroo")
  const {multimediaId} = request.params;
  const token = request.headers.authorization.replace("Bearer ", "");
  const { id } = jwt.verify(token, myPrivateKey);
  if (token) {
    const { paypalId  } = request.body;
    connection.query(
      `SELECT *
       FROM purchases
       WHERE idBuyer = ${id} AND multimediaId = ${multimediaId}`, (error, results) =>{
        if(error) console.log(error)
      else if (results && results.length){
        console.log(results);
        response.send("Already purchased");
      }else{
        connection.query(
          `
        INSERT
        INTO purchases (idBuyer, multimediaId, paypalId)
        VALUES('${id}', '${multimediaId}', '${paypalId}')
      `,
          (error, results) => {
            let aux = false;
            if (error) {
              console.log(error);
              response.send(aux);
            } else {
              aux = true;
              console.log(results);
              response.send(aux)
            }
          }
        );
      }
    })

  }
};

//CHECKING IF PURCHASED
multimediaController.isPurchased = (request, response) => {
  const { multimediaId } = request.params;
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    const { id } = jwt.verify(token, myPrivateKey);
    connection.query(
      `
    SELECT *
    FROM purchases
    WHERE multimediaId = '${multimediaId}' 
    AND idBuyer = ${id}
    `,
      (error, results) => {
        let aux = true;
        if (results && results.length) {
          console.log(aux)
          response.send(aux);
        } else {
          aux = false;
          response.send(aux);
        }
      }
    );
  }
};

//GET USER PURCHASES
multimediaController.getUserPurchases = (request, response) => {
  console.log('donde estás?')
  const { id } = request.params;
  console.log(id)
  const { authorization } = request.headers;
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, myPrivateKey);
    connection.query(
      `
      SELECT title, description, time, path, type, price, category, textArea, multimedia.multimediaId, id, paypalId
      FROM multimedia 
      LEFT JOIN purchases on multimedia.multimediaId = purchases.multimediaId 
      WHERE purchases.idBuyer = ${id} ORDER BY TIME DESC;
        `,
      (error, results) => {
        console.log(results)
        if (results && results.length > 0) {
          response.send(results);
        } else {
          console.log(error);
          response.sendStatus(400);
        }
      }
    );
  }
};

module.exports = multimediaController;
