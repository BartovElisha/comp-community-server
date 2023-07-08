const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts');

// CRUD operation routes
// Create
router.post('/', posts.create);

// Read
router.get('/', posts.list);
router.get('/:id',posts.details);
router.get('/user/:id',posts.userPosts);

// Update
router.patch('/:id', posts.updateDetails);
router.patch('/updatelikeslist/:id', posts.updateLikesList);
router.patch('/addcomment/:id', posts.addComment);

// Delete
router.delete('/:id', posts.delete);

module.exports = router;