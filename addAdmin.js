const mongoose = require('mongoose');
// const Admin = require('./models/adminModel'); // Import the Admin model
require('dotenv').config();
const bcrypt = require('bcrypt');
const adminSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed password
  googleAuthSecret: String, // Store secret for OTP verification
});

adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hash password before saving
  }
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const newAdmin = new Admin({
        username: 'pushkar',
        password: 'bacgaming@62.890', // This will be hashed automatically
        googleAuthCode: '', // Replace with the actual Google Authenticator code
      });

      await newAdmin.save();
      console.log('Admin credentials saved.');
    } else {
      console.log('Admin already exists.');
    }
    mongoose.connection.close();
  })
  .catch(err => console.error('Database connection error:', err));
