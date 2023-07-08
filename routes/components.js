const express = require('express');
const router = express.Router();
const components = require('../controllers/components');

// CRUD operation routes
// Create
router.post('/', components.create);

// Read
router.get('/', components.list);
router.get('/:id',components.details);
router.get('/user/:id',components.userComponents);

// Update
router.patch('/:id', components.updateDetails);
router.patch('/updatelikeslist/:id', components.updateLikesList);

// Delete
router.delete('/:id', components.delete);

module.exports = router;