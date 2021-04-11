const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  discord_id: {
    type: Number,
    default: "",
  },
  is_banned: {
    type: Boolean,
    default: false,
  },
  unban_time: {
    type: Number,
  },
  server_id: {
    type: Number,
  },
});

module.exports = mongoose.model("User", UserSchema);
