const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function testDatabaseConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('Database URI:', process.env.DATABASE ? 'Found' : 'Not found');

    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE);

    console.log('✅ MongoDB connection successful!');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Connection ready state:', mongoose.connection.readyState);

    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(
      '📊 Available collections:',
      collections.map((c) => c.name)
    );

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection test completed successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);

    if (error.name === 'MongoServerError' && error.code === 8000) {
      console.log('💡 Possible solution: Check your MongoDB Atlas IP whitelist');
    }

    process.exit(1);
  }
}

testDatabaseConnection();
