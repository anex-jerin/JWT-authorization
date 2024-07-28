const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Mongo DB connection
const databaseConnection = async (link) => {
  await mongoose.connect(link);
  console.log('Database is connected');
};

//Global error Handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}); 

// SERVER setup
const start = async () => {
  try {
    await databaseConnection(MONGO_URI);
    app.listen(port, () => {
      console.log(`Connected to PORT:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
