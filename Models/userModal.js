const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    Username: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Register",
  }
);

module.exports = mongoose.model("Register", userSchema);
