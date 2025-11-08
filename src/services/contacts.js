import Contact from "../db/models/contact.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  filters = {},
}) => {
  const skip = (page - 1) * perPage;
  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const data = await Contact.find(filters)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(perPage));

  const totalItems = await Contact.countDocuments(filters);
  return { data, totalItems };
};

export const getContactById = (id) => Contact.findById(id);

export const createContact = (body) => Contact.create(body);

export const updateContact = (id, body) =>
  Contact.findByIdAndUpdate(id, body, { new: true });

export const deleteContact = (id) => Contact.findByIdAndDelete(id);