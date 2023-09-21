const mongoose = require("mongoose");

const Contact = new mongoose.model("Contact", {
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now(),
  },

  statut: { type: Boolean, default: 1 },
});

module.exports = Contact;
