import express from "express";
import cors from 'cors';
import path from "path";
import dotenv from 'dotenv';

import connectDB from './db.js';
import postRoutes from './routes/postRoutes.js';
import userRouter from './routes/userRoutes.js';
import birthDayRouter from "./routes/birthDayRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import festivalRouter from "./routes/festivalRoutes.js";
import marriageRouter from "./routes/marriageRoute.js"
import { templeRouter } from "./routes/templeRoutes.js";
import { scheduleRouter } from "./routes/scheduleRoutes.js";
import { watchSchedules } from "./AutoSchedular/scheduleJob.js";
import createPredefinedTemplates from "./utils/createPredefinedTemplates.js";

dotenv.config();

const app = express();

// Middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes for birthdays management
app.use('/birthdays', birthDayRouter);


// Routes for events management
app.use('/events', eventRouter);

app.use("/festivals", festivalRouter);

app.use("/marriages", marriageRouter);

// Routes for user management
app.use('/users', userRouter);

// Routes for temple information
app.use("/temple", templeRouter);

// Routes for post management
app.use('/post', postRoutes);

//Routes for schedule 
app.use("/schedule", scheduleRouter);



// Server setup
const port = process.env.DB_PORT || 3000;  // Default port is 3000 if DB_PORT is not specified
app.listen(port, async () => {
  console.log(`Server Started on port ${port}`);
  // Connect to MongoDB
  await connectDB();
  // Start watching the collection for scheduling
  await watchSchedules();
  // Create predefined templates
  await createPredefinedTemplates();

  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + 5);
  console.log(currentDate);
});
