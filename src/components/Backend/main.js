import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';  // Corrected import to match the ES module system

dotenv.config();  // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());  // Parse JSON bodies

// Routes
app.use('/api/users', authRoutes);  // Use auth routes for user signup and login

// Connect to MongoDB
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
