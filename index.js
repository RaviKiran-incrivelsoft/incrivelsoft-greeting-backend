const express = require("express");
const cors = require('cors');
const path = require("path");
require('dotenv').config();

const connectDB = require('./db');
const campaignRoutes = require('./routes/campaignRoutes');
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express()

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/emails', emailRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/users', userRoutes);

const port = process.env.DB_PORT;

connectDB();
app.listen(port, () => console.log(`Server Started on ${port}`))
