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
router.post("/getMore", multimedia.getMoreMultimedia); //CHANGE FROM GET!!!!!!***
router.get("/", multimedia.getMultimedia); 
router.get("/:type", multimedia.getMultimediaByType);
router.post("/byUserAndType/:id", multimedia.getMultimediaByUserAndType);
router.get("/single/:multimediaId", multimedia.getOneMultimedia);
router.get("/byPrice/:price", multimedia.getMultimediaByPrice);
router.get("/byPriceAndUser/:id/:price", multimedia.getMultimediaByPriceAndUser);


router.get("/redkaneLive", multimedia.getRedkaneLiveMultimedia);
router.get("/redkaneLive/:type", multimedia.getRedkaneLiveMultimediaByType);
router.get("/isPurchased/:multimediaId", multimedia.isPurchased);
router.get("/userPurchases/:id", multimedia.getUserPurchases);


//POST
router.post("/createArticle", upload, multimedia.createArticle);
router.post("/byCategory/:category", multimedia.getMultimediaCategories);
router.post("/byCategoryAndUser/:id/:category", multimedia.getMultimediaCategoriesAndUser);
router.post("/addPurchase/:multimediaId", multimedia.addPurchase);
router.post("/createImage", upload, multimedia.createImage);
router.post("/createVideo", upload, multimedia.createVideo);
router.post("/update/:multimediaId", upload, multimedia.updateArticle);
router.post("/searchByWord", multimedia.searchMultimediaByWord);
router.post("/searchByWordAndId/:id", multimedia.searchMultimediaByWordAndUser);
router.post("/searchRedkaneLive", multimedia.searchMultimediaRedkaneLive);

//PUT
// router.put("/like/:id", multimedia.likeMultimedia);
// router.put("/dislike/:id", multimedia.dislikeMultimedia);
router.delete("/delete/:multimediaId", multimedia.deleteMultimedia);

module.exports = router;
