const express = require('express');
const router = express.Router();

const users = require('../controllers/usersController.js')

router.get('/', users.getUsers);
router.post('/register', users.createUser);
router.post('/login', users.login);
router.get('/:id', users.getUser);
router.put('/edit/:id', users.editUser);
router.delete('/delete/:id', users.deleteUser);
router.put('/saveArticle/:id', users.saveArticle);
router.put('/unsaveArticle/:id', users.unsaveArticle);
router.put('/followUser/:id', users.followUser);
router.put('/unfollowUser/:id', users.unfollowUser);


module.exports = router;