const mongoose = require('mongoose');

const equationSchema = new mongoose.Schema({
  expression: String,
  inputs: Object,
  result: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('equation', equationSchema);
