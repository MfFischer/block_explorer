// server/src/app.js
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Adjust this to match your frontend URL
}));
app.use(express.json());

// Import and use routes
const blockRoutes = require('./routes/blockRoutes');
app.use('/api/block', blockRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
