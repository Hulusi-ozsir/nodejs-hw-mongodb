const express = require('express');
const router = express.Router();
const { getContacts, getContactById } = require('../controllers/contactsController');

router.get('/', getContacts);
router.get('/:contactId', getContactById);

module.exports = router;