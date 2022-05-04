const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');

router.get('/', controller.index);

router.get('/about', controller.about);

router.get('/contact', controller.contact);

router.get('/error', controller.error);

module.exports = router;