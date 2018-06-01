const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const stockSchema = new Schema({
  symbol: {
    type: String,
    required: 'Please supply a symbol'
  }
});

module.exports = mongoose.model('Stock', stockSchema);