const mongoose = require('mongoose');
const { DB_URL } = require('./server-config');
const connect = async () => {

    try {
        await mongoose.connect(DB_URL);
        console.log('MongoDB connected');
      } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit process with failure
      }
}

module.exports = connect;