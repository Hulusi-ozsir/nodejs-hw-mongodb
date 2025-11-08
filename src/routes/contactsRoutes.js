const express = require('express');
const {
  getContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact
} = require('../controllers/contactsController');
const ctrlWrapper = require('../utils/ctrlWrapper');

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', ctrlWrapper(createContact));
router.patch('/:contactId', ctrlWrapper(patchContact));
router.delete('/:contactId', ctrlWrapper(deleteContact));

module.exports = router;