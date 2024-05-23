const express = require('express');
const mongoose = require('mongoose');
const { config } = require('dotenv');
config();
const bookRoutes = require('./routes/book.routes');

const app = express();
const port = process.env.PORT || 85;

app.use(express.json());
app.use('/books', bookRoutes);

mongoose
  .connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME })
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
