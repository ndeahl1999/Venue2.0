// User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for the Users
let User = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: null,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    default: null,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  password: {
      type: String,
      trim: true,
      select:false
  },
  status: {
      type: Boolean,
      default: false
  },
  createdAt: {
      type: Date,
      default: Date.now()
  },
},{
    collection: 'User'
});

module.exports = mongoose.model('User', User);
