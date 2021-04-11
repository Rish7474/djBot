const mongoose = require("mongoose");

// Import User model from Mongoose
const User = require('./models/User');

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log("connected to DB")
);

async function isBanned(event) {
  const discord_username = `${event.author.username}#${event.author.discriminator}`;
  const discord_server_id = event.guild.id;
  const userInDB = await User.findOne({ discord_username, discord_server_id });
  let isUserBanned = false;

  if (!userInDB) { // If the user doesn't exist, add them to the DB
    const newUser = new User({
      discord_username,
      discord_server_id,
    })
    await newUser.save();
  }
  if (userInDB.is_banned) {
    isUserBanned = true;
  }
  return Promise.resolve(isUserBanned);
}

async function banUser(discord_username, timeToBan, discord_server_id) {
  const user = await User.findOne({ discord_username, discord_server_id });
  const now = new Date();
  const unban_time = Math.round(now.getTime() / 1000) + (timeToBan * 60);

  user.is_banned = true;
  user.unban_time = unban_time;
  user.save();
}

async function autoUnban() {
  const bannedUsers = await User.find({ is_banned: true });
  const currentTime = Math.round(new Date().getTime() / 1000);

  bannedUsers.forEach(async (user) => {
    if (user.unban_time < currentTime) {
      user.is_banned = false;
      await user.save();
      console.log(`Ban lifted for ${user.discord_username}`);
    }
  })
}

module.exports = { isBanned, banUser, autoUnban };