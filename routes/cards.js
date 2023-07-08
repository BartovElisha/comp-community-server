const express = require('express');
const router = express.Router();
const cards = require('../controllers/cards');

router.get('/', cards.list);
router.get('/:id', cards.details);
router.get('/user/:id', cards.userCards);

router.post('/', cards.addNew);
router.patch('/:id', cards.updateDetails);
router.patch('/updatecardlikeslist/:id', cards.updateCardLikesList);
router.delete('/:id', cards.deleteCard);

module.exports = router;