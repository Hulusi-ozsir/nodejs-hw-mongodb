const express = require('express');
const router = express.Router();
const parser = require('../middlewares/upload');
const contactsController = require('../controllers/contactsController');

router.post('/contacts', parser.single('photo'), contactsController.createContact);
router.patch('/contacts/:contactId', parser.single('photo'), contactsController.updateContact);

module.exports = router;