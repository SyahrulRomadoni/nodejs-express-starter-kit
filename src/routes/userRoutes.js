// src/routes

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
router.get('/:uuid', authenticateToken, read);
router.put('/:uuid', authenticateToken, updated);
router.delete('/:uuid', authenticateToken, deleted);

module.exports = router;