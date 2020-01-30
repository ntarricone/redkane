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
  



router.get("/", multimedia.getMultimedia);
router.post("/create", upload, multimedia.createMultimedia);
router.get("/:id", multimedia.getMultimediaByUser);
router.get("/single/:multimediaId", multimedia.getOneMultimedia);
// router.get("/likedByUser/:id", multimedia.getMultimediaLikedByUser);
router.put("/update/:multimediaId", multimedia.editMultimedia);
// router.put("/like/:id", multimedia.likeMultimedia);
// router.put("/dislike/:id", multimedia.dislikeMultimedia);
router.put("/delete/:multimediaId", multimedia.deleteMultimedia);

module.exports = router;
