const express = require('express');
const router = express.Router();
const multer = require('multer');

const users = require('../controllers/usersController.js')

const storage = multer.diskStorage({
    destination: "public/images",
    filename: (_req, file, cb) => {
      const extension = file.originalname.slice(
        file.originalname.lastIndexOf(".")
      );
      cb(null, new Date().valueOf() + extension); 
    }
  });

  const upload = multer({ storage }).single("file");

//GET
router.get('/', users.getUsers);
router.get('/:id', users.getUser);

//PUT
router.put('/edit/:id', users.editUser);
router.put('/editPassword/:id', users.editPassword);

//POST
router.post('/register', users.createUser);
router.post('/login', users.login);
router.post('/saveUnsaveMultimedia', users.saveUnsaveMultimedia);
router.post('/confirmCreator/:id', users.confirmCreator);
router.post('/updateSocialMedia/:id', users.updateSocialMedia);

//PUT
router.put('/followUser/:id', users.followUser);
router.put('/unfollowUser/:id', users.unfollowUser);
router.post('/uploadBanner', upload, users.uploadBanner);
router.post('/uploadAvatar', upload, users.uploadAvatar);

//DELETE
router.delete('/delete/:id', users.deleteUser);



module.exports = router;