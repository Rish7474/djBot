const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  discord_username: {
    type: String,
    required: true,
    default: "",
  },
  is_banned: {
    type: Boolean,
    default: false,
  },
  unban_time: {
    type: Number,
    default: 0,
  },
  discord_server_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
