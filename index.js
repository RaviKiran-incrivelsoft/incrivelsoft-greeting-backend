const express = require("express");
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const campaignRoutes = require('./routes/campaignRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express()

app.use(cors());
app.use(express.json());

app.use('/campaigns', campaignRoutes);
app.use('/users', userRoutes);

const port = process.env.DB_PORT;

connectDB();
app.listen(port, () => console.log(`Server Started on ${port}`))
