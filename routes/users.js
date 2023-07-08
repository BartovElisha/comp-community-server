var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const users = require('../controllers/users');

// Authentication and Autorisation
router.post('/signin', users.signin);
router.post('/uservalidate', users.userValidate);
router.post('/signup', users.signup);
router.post('/signupbusiness', users.signupBusiness);

// Read
router.get('/', auth, users.list);
router.get('/:id', auth, users.details);
router.post('/', users.sendSecretCode);

// Update
router.patch('/updatepassword', users.updatePassword);
router.patch('/activate/:id', auth, users.activateUser);
router.patch('/deactivate/:id', auth, users.deactivateUser);
router.patch('/updatebussinesuser/:id', auth, users.updateBussinesUser);

module.exports = router; 