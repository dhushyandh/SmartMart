// Imports
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import passport from 'passport';
import './config/passport.js'; // Ensure the .js extension is present
import authRouter from './routes/auth.js'; // Import your new auth routes

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to Databases
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/auth', authRouter); // Use the imported authRouter here

app.get('/', (req, res) => {
    res.send('API Working !');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});