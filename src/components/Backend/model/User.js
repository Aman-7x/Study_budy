import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
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
    minlength: 6,
  },
  blogs: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Blog', // Refers to the "Blog" model
      required: true,
    },
  ],
});

// Export the model
export default mongoose.model('User', userSchema);
// The collection in MongoDB will be named "users"
