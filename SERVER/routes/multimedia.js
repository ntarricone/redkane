const express = require("express");
const router = express.Router();
const multimedia = require("../controllers/multimediaController.js");
const multer = require("multer");


  const storage = multer.diskStorage({
    destination: "public/multimedia",
    filename: (_req, file, cb) => {
      const extension = file.originalname.slice(
        file.originalname.lastIndexOf(".")
      );
      cb(null, new Date().valueOf() + extension); 
    }
  });
  
  const upload = multer({ storage }).single("file");
  


//GET
router.get("/", multimedia.getMultimedia);
router.get("/:type", multimedia.getMultimediaByType);
router.get("/byUserAndType/:id/:type", multimedia.getMultimediaByUserAndType);
router.get("/single/:multimediaId", multimedia.getOneMultimedia);


//POST
router.post("/createArticle", upload, multimedia.createArticle);
router.post("/createImage", upload, multimedia.createImage);
router.post("/createVideo", upload, multimedia.createVideo);
router.post("/update/:multimediaId", upload, multimedia.updateArticle);
router.post("/searchByWord", multimedia.searchByWordMultimedia);

//PUT
// router.put("/like/:id", multimedia.likeMultimedia);
// router.put("/dislike/:id", multimedia.dislikeMultimedia);
router.delete("/delete/:multimediaId", multimedia.deleteMultimedia);

module.exports = router;
