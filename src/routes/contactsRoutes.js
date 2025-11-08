import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as contactsController from '../controllers/contactsController.js';

const router = Router();

router.get('/', ctrlWrapper(contactsController.getAllContacts));
router.post('/', ctrlWrapper(contactsController.addContact));

export default router;