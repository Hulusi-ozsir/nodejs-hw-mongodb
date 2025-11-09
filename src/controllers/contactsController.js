import createHttpError from 'http-errors';
import Contact from '../db/models/Contact.js';

// Yeni Contact oluşturma
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const photo = req.file ? req.file.path : null;

    const newContact = new Contact({ name, email, phone, photo });
    await newContact.save();

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact
    });
  } catch (err) {
    next(err);
  }
};

// Var olan Contact güncelleme
export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const photo = req.file ? req.file.path : undefined;

    const contact = await Contact.findById(contactId);
    if (!contact) throw createHttpError(404, 'Contact not found!');

    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;
    if (photo) contact.photo = photo;

    await contact.save();

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (err) {
    next(err);
  }
};