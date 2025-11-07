const Contact = require('../db/Contact');

/**
 * getAllContacts: tüm kayıtları döndürür
 * @returns {Promise<Array>}
 */
const getAllContacts = async () => {
  return Contact.find().lean();
};

/**
 * getContactById: id ile tek contact döndürür
 * @param {String} contactId
 * @returns {Promise<Object|null>}
 */
const getContactById = async (contactId) => {
  return Contact.findById(contactId).lean();
};

module.exports = {
  getAllContacts,
  getContactById
};