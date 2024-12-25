import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is modified or is new
  try {
    const salt = await bcrypt.genSalt(10); // Use bcryptjs for salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password (used for login)
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Use bcryptjs for comparison
};

const UserDetails = mongoose.model('UserDetails', userSchema);

export default  UserDetails ;
