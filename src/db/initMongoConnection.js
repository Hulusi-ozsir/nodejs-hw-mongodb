const mongoose = require('mongoose');

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_URL,
  MONGODB_DB
} = process.env;

/**
 * initMongoConnection: Mongoose ile MongoDB Atlas kümesine bağlanır.
 * Ortam değişkenlerini .env veya Render gibi yerlerden alır.
 */
const initMongoConnection = async () => {
  if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
    throw new Error('Missing MongoDB environment variables (MONGODB_*)');
  }

  const uri = `mongodb+srv://${encodeURIComponent(
    MONGODB_USER
  )}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // Başarılı bağlantı
    // eslint-disable-next-line no-console
    console.log('Mongo connection successfully established!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Mongo connection error:', error);
    throw error;
  }
};

module.exports = initMongoConnection;