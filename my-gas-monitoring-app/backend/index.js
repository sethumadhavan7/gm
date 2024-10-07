const express = require('express'); 
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoUri = 'mongodb+srv://sethu:1234@cluster0.dbntwx8.mongodb.net/gasmonitoring?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const gasRoutes = require('./routes/gasRoutes');
app.use('/api/gas-data', gasRoutes);

// Add a simple route for the root URL "/"
app.get('/', (req, res) => {
  res.send('Welcome to the Gas Monitoring API');
});

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
