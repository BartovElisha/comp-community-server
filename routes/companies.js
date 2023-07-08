const express = require('express');
const router = express.Router();
const companies = require('../controllers/companies');

// CRUD operation routes
// Create
router.post('/', companies.create);

// Read
router.get('/', companies.list);
router.get('/:id',companies.details);
router.get('/user/:id',companies.userCompanies);

// Update
router.patch('/:id', companies.updateDetails);
router.patch('/updatelikeslist/:id', companies.updateLikesList);

// Delete
router.delete('/:id', companies.delete);

module.exports = router;