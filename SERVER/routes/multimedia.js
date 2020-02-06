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
// router.get("/likedByUser/:id", multimedia.getMultimediaLikedByUser);

//POST
router.post("/createMultimedia", upload, multimedia.createMultimedia);
router.post("/createVideo", upload, multimedia.createVideo);
router.post("/createEditor", multimedia.createVideo);


//PUT
router.put("/update/:multimediaId", multimedia.editMultimedia);
// router.put("/like/:id", multimedia.likeMultimedia);
// router.put("/dislike/:id", multimedia.dislikeMultimedia);
router.put("/delete/:multimediaId", multimedia.deleteMultimedia);

module.exports = router;
