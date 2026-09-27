require('dotenv').config();
const dns = require('dns');

// Paksa DNS Publik Google
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Jangan biarkan Mongoose menampung query kalau jaringan putus
mongoose.set('bufferCommands', false);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4, // Paksa koneksi lewat IPv4
    });
    console.log('✅ MongoDB Connected!');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
};

startServer();