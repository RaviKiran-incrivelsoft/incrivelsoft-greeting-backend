import express from "express";
import cors from 'cors';
import path from "path";
import dotenv from 'dotenv';

import connectDB from './db.js';
import campaignRoutes from './routes/campaignRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { templeRouter } from "./routes/templeRoutes.js";
import { scheduleRouter } from "./routes/scheduleRoutes.js";
import {watchSchedules, scheduleJobs} from "./AutoSchedular/scheduleJob.js";

dotenv.config();

const app = express();

// Middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes for campaign management
app.use('/campaigns', campaignRoutes);

// Routes for user management
app.use('/users', userRoutes);

// Routes for temple information
app.use("/temple", templeRouter);

//Routes for schedule 
app.use("/schedule", scheduleRouter);


// Server setup
const port = process.env.DB_PORT || 3000;  // Default port is 3000 if DB_PORT is not specified
app.listen(port, async () => {
  console.log(`Server Started on port ${port}`);
  // Connect to MongoDB
  await connectDB();
  // Start watching the collection for scheduling
  await scheduleJobs();
  await watchSchedules();
});
