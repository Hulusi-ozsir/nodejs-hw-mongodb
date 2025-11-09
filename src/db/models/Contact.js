import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  photo: { type: String, default: null }
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;  // <-- default export eklendi