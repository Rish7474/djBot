require("dotenv").config();

const { Client } = require("discord.js");
const client = new Client();

const { Player } = require("discord-player");
client.player = new Player(client);

const ActionHandler = require("./actions.js");
actions = new ActionHandler(client.player);

const { isBanned, autoUnban } = require("./db");
const startCron = require("./cron");

client.on("ready", () => {
  console.log(`${client.user.tag} is online`);
});

client.on("message", async (eventInfo) => {
  if (!eventInfo.author.bot) {
    if (await isBanned(eventInfo)) { // If they aren't banned, keep
      console.log("user is banned");
    } else {
      if (eventInfo.content[0] === process.env.INVOKE_TAG) {
        let cmdQuery = eventInfo.content.substring(1);
        status = await actions.processAction(eventInfo, cmdQuery);
        eventInfo.channel.send(status[1]);
      } else {
        let cmdQuery = eventInfo.content;
        status = await actions.processNaturalLanguage(
          eventInfo,
          cmdQuery,
          process.env.BOT_NAME
        );
        if (status[0] != undefined) eventInfo.channel.send(status[1]);
      }
    }
  }
});

startCron();

client.login(process.env.DISCORDJS_BOT_TOKEN);
