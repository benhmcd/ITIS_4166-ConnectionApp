const express = require('express');
const router = express.Router();
const controller = require('../controllers/connectionController');
const {isLoggedIn, isHost, isNotHost} = require('../middlewares/auth');
const {validateId, validateConnection, validateResult, validateRSVP} = require('../middlewares/validator');

//GET /connections: sends all connections to the user
router.get('/', controller.index);

//GET /connections/new: sends html form for creating a new connection
router.get('/new', isLoggedIn, controller.new);

//POST /connections: creates a new connection
router.post('/', isLoggedIn, validateConnection, validateResult, controller.create);

//GET /connections/:id sends thhe details of the connection identified by the id
router.get('/:id', validateId, controller.show);

//GET /connections/:id/edit: sends the html form for editing an existing connection
router.get('/:id/edit', validateId, isLoggedIn, isHost, controller.edit);

//PUT /connections/:id: updates the connection identified by the id
router.put('/:id', validateId, isLoggedIn, isHost, validateConnection, validateResult, controller.update);

//DELETE /connections/:id: deletes the connection identified by the id
router.delete('/:id', validateId, isLoggedIn, isHost, controller.delete);

router.post('/:id/rsvp', isLoggedIn, isNotHost, validateRSVP, validateResult, controller.rsvp);

module.exports = router;