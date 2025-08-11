// app/routes

const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const {
    getCurrent,
    index,
    created,
    read,
    updated,
    deleted
} = require('../controllers/userControllers');

const router = express.Router();
router.routeName = '/user';

router.get('/current', authenticateToken, getCurrent);
router.get('/', authenticateToken, index);
router.post('/', authenticateToken, created);
router.get('/:id', authenticateToken, read);
router.put('/:id', authenticateToken, updated);
router.delete('/:id', authenticateToken, deleted);

module.exports = router;