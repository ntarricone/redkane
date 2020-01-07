const express = require('express');
const router = express.Router();

const images = require('../controllers/imagesController.js')

router.get('/', images.getImages);
router.post('/add-image', images.createImage);
router.get('/:id', images.getImage);
router.put('/update/:id', images.editImage);
router.delete('/delete/:id', images.deleteImage);

module.exports = router;