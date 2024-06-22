import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/WEBAPP', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

const app = express();

// Directory path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from public directory (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS with credentials
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from this origin
    credentials: true,  // Enable credentials (cookies, authorization headers)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// User routes
app.use('/users', userRoute);

// Admin routes (if needed)
app.use('/admin', adminRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
