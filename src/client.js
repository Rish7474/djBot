require('dotenv').config();


const {Client} = require('discord.js');
const client = new Client();

const { Player } = require('discord-player');
client.player = new Player(client);

const ActionHandler  = require('./actions.js');
actions = new ActionHandler(client.player);

client.on('ready', () => {
    console.log(`${client.user.tag} is online`);
});

client.on('message', (message) => {
    if(!message.author.bot) {
        if (message.content[0] === process.env.INVOKE_TAG) {
            let cmdQuery = message.content.substring(1);
            status = actions.processAction(message, cmdQuery);
            message.channel.send(status[1]);
        }
        else {
            let cmdQuery = message.content;
            status = actions.processNaturalLanguage(message, cmdQuery, process.env.BOT_NAME);
            if(status[0] != undefined)
                message.channel.send(status[i]);
        }
            
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
