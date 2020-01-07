const express = require('express');
const router = express.Router();

const videos = require('../controllers/videosController.js')

router.get('/', videos.getVideos);
router.post('/add-video', videos.createVideo);
router.get('/:id', videos.getVideo);
router.put('/update/:id', videos.editVideo);
router.delete('/delete/:id', videos.deleteVideo);

module.exports = router;