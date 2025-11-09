import express from 'express';
import parser from '../middlewares/upload.js';
import { createContact, updateContact } from '../controllers/contactsController.js';

const router = express.Router();

router.post('/contacts', parser.single('photo'), createContact);
router.patch('/contacts/:contactId', parser.single('photo'), updateContact);

export default router;  // <-- default export eklendi