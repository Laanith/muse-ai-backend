const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://mohanasreeummidi:HWB6futFZadlifxQ@content-generator-ai.04nk0vv.mongodb.net/?retryWrites=true&w=majority&appName=CONTENT-GENERATOR-AI"
    );
    console.log(`MONGODB CONNECTED SUCCESSFULLY TO ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;
