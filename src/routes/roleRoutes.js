// src/routes

const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const {
    index,
    created,
    read,
    updated,
    deleted
} = require('../controllers/roleControllers');

const router = express.Router();
router.routeName = '/role';

router.get('/', authenticateToken, index);
router.post('/', authenticateToken, created);
router.get('/:uuid', authenticateToken, read);
router.put('/:uuid', authenticateToken, updated);
router.delete('/:uuid', authenticateToken, deleted);

module.exports = router;