const express = require('express');
const router = express.Router();

const users = require('../controllers/usersController.js')

router.get('/', users.getUsers);
router.post('/register', users.createUser);
router.post('/login', users.login);
router.get('/:id', users.getUser);
router.put('/edit/:id', users.editUser);
router.delete('/delete/:id', users.deleteUser);
router.post('/saveUnsaveMultimedia', users.saveUnsaveMultimedia);
router.put('/followUser/:id', users.followUser);
router.put('/unfollowUser/:id', users.unfollowUser);


module.exports = router;