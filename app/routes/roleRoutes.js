// app/routes

const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const {
    index,
    created,
    read,
    updated,
    deleted
} = require('../controllers/roleController');

const router = express.Router();

router.get('/', authenticateToken, index);
router.post('/', authenticateToken, created);
router.get('/:id', authenticateToken, read);
router.put('/:id', authenticateToken, updated);
router.delete('/:id', authenticateToken, deleted);

module.exports = router;