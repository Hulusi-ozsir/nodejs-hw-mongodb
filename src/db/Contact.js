const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required']
    },
    email: {
      type: String,
      default: ''
    },
    isFavourite: {
      type: Boolean,
      default: false
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal'
    }
  },
  {
    timestamps: true
  }
);

// Model adı: Contact -> koleksiyon adı mongo'da 'contacts' olur
module.exports = mongoose.model('Contact', contactSchema);