import Contact from '../db/models/Contact.js'; // bulunduğu konuma göre path'ı kontrol edin

export const getAllContacts = async ({ page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filters = {}, userId }) => {
  const skip = (Number(page) - 1) * Number(perPage);
  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const query = { ...filters, userId };

  const data = await Contact.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(perPage))
    .lean();

  const totalItems = await Contact.countDocuments(query);
  return { data, totalItems };
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId }).lean();
};

export const createContact = async (body) => {
  return Contact.create(body);
};

export const updateContact = async (contactId, userId, body) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, body, { new: true }).lean();
};

export const deleteContact = async (contactId, userId) => {
  const doc = await Contact.findOneAndDelete({ _id: contactId, userId });
  return !!doc;
};