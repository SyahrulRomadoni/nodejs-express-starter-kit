// app/routes

const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const {
    getCurrent,
    index,
    read,
    updated,
    deleted
} = require('../controllers/userController');

const router = express.Router();

router.get('/current', authenticateToken, getCurrent);
router.get('/', authenticateToken, index);
router.get('/:uuid', authenticateToken, read);
router.put('/:uuid', authenticateToken, updated);
router.delete('/:uuid', authenticateToken, deleted);

module.exports = router;