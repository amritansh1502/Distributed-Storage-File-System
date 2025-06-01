require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const uploadRoutes = require('./routes/upload');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

app.use(express.json());
app.use('/api', uploadRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
