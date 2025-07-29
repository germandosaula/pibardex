const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pibardex';
    
    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 URI: ${mongoURI}`);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // If MongoDB is not available, provide helpful instructions
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 MongoDB Setup Instructions:');
      console.log('1. Install MongoDB:');
      console.log('   macOS: brew install mongodb-community');
      console.log('   Or download from: https://www.mongodb.com/try/download/community');
      console.log('\n2. Start MongoDB:');
      console.log('   macOS: brew services start mongodb-community');
      console.log('   Or: mongod --config /usr/local/etc/mongod.conf');
      console.log('\n3. Alternative: Use MongoDB Atlas (cloud):');
      console.log('   https://www.mongodb.com/atlas');
      console.log('\n4. Update MONGODB_URI in .env file');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;