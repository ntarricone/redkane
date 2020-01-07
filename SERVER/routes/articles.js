const express = require('express');
const router = express.Router();

const articles = require('../controllers/articlesController.js')

router.get('/', articles.getArticles);
router.post('/create', articles.createArticle);
router.get('/:id', articles.getArticle);
router.get('/likedByUser/:id', articles.getArticleLikedByUser); //the id here is for the user
router.put('/update/:id', articles.editArticle);
router.put('/like/:id', articles.likeArticle);
router.put('/dislike/:id', articles.dislikeArticle);
router.delete('/delete/:id', articles.deleteArticle);

module.exports = router;