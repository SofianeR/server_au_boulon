const mongoose = require("mongoose");

const User = new mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },

  username: {
    required: true,
    type: String,
  },

  salt: String,
  hash: String,
  token: String,

  statut: { default: 1, type: Boolean },
});

module.exports = User;
