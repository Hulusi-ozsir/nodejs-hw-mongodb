import { Router } from 'express';
import * as contactsController from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(contactsController.getAllContacts));
router.get('/:id', ctrlWrapper(contactsController.getContactById));
router.post('/', ctrlWrapper(contactsController.createContact));
router.put('/:id', ctrlWrapper(contactsController.updateContact));
router.delete('/:id', ctrlWrapper(contactsController.deleteContact));

export default router;