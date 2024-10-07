const express = require('express');
const GasData = require('../models/gasData');

const router = express.Router();

// Endpoint to receive gas data
router.post('/', async (req, res) => {
  try {
    const gasData = new GasData(req.body);
    await gasData.save();
    res.status(200).send('Data received and stored');
  } catch (error) {
    res.status(500).send('Error saving data');
  }
});

// Endpoint to get the most recent gas data
router.get('/', async (req, res) => {
  try {
    const data = await GasData.findOne().sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

module.exports = router;
