const createError = require('http-errors');
const contactsService = require('../services/contacts');

const getContacts = async (req, res) => {
  const contacts = await contactsService.getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts
  });
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact
  });
};

const createContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Name, phoneNumber, and contactType are required');
  }

  const newContact = await contactsService.createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact
  });
};

const patchContact = async (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;
  const updatedContact = await contactsService.updateContact(contactId, updateData);
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact
  });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deleted = await contactsService.deleteContact(contactId);
  if (!deleted) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact
};