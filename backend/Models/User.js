const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    type: String,
    require: true,
    unique: true,
  },
  token: String,
  salt: String,
  hash: String,
  account: {
    username: {
      type: String,
      minlength: 3,
      maxlength: 20,
      require: true,
      unique: true,
      sparse: true,
    },
    dateOfBirth: {
      type: Date,
    },
    subfamily: {
      type: String,
      enum: ["Asiatique", "Africain", "A définir"],
      default: "A définir",
    },
    breed: {
      type: String,
      default: "A définir",
    },
    friends: { type: Array, default: [] },
    deleted: {
      type: Boolean,
      default: false,
    },
    food: { type: String },
  },
});

module.exports = User;
