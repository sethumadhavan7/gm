const mongoose = require('mongoose');

const gasDataSchema = new mongoose.Schema({
  co2: { type: Number, required: true },
  so2: { type: Number, required: true },
  nox: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const GasData = mongoose.model('GasData', gasDataSchema);

module.exports = GasData;
