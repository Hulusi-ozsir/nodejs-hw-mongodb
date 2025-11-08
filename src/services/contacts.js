const Contact = require('../db/Contact');

const getAllContacts = async () => Contact.find().lean();

const getContactById = async (contactId) => Contact.findById(contactId).lean();

const createContact = async (data) => Contact.create(data);

const updateContact = async (contactId, updateData) => {
  return Contact.findByIdAndUpdate(contactId, updateData, { new: true });
};

const deleteContact = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) return null;
  await Contact.deleteOne({ _id: contactId });
  return true;
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};