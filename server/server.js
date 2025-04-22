import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json());
app.use(cookieParser())
const PORT = process.env.PORT || 5000

import eventRoutes from './routes/eventRoutes.js';
app.use('/api/events', eventRoutes);

import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server  on port ${PORT}`);
    });
  })
  .catch((err) => console.log(' Mongo error:', err));
