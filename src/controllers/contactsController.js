import Contact from '../db/models/Contact.js';

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
};

export const addContact = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';

export const getContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite
  } = req.query;

  const filters = {};
  if (type) filters.contactType = type;
  if (isFavourite !== undefined) filters.isFavourite = isFavourite === 'true';

  const userId = req.user._id;

  const { data, totalItems } = await contactsService.getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
    userId
  });

  const totalPages = Math.ceil(totalItems / Number(perPage) || 1);

  return res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages,
      hasPreviousPage: Number(page) > 1,
      hasNextPage: Number(page) < totalPages
    }
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await contactsService.getContactById(contactId, userId);
  if (!contact) throw createError(404, 'Contact not found');
  return res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact
  });
};

export const createContact = async (req, res) => {
  const body = req.body;
  body.userId = req.user._id; // add userId
  const newContact = await contactsService.createContact(body);
  return res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact
  });
};

export const patchContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const updated = await contactsService.updateContact(contactId, userId, req.body);
  if (!updated) throw createError(404, 'Contact not found');
  return res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const deleted = await contactsService.deleteContact(contactId, userId);
  if (!deleted) throw createError(404, 'Contact not found');
  return res.status(204).send();
};