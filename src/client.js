require('dotenv').config();

var express = require('express');
var app     = express();

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error (found on https://bit.ly/2RjMRGj)
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
    const {Client} = require('discord.js');
    const client = new Client();

    const { Player } = require('discord-player');
    client.player = new Player(client);

    const ActionHandler = require('./actions.js');
    actions = new ActionHandler(client.player);

    client.on('ready', () => {
        console.log(`${client.user.tag} is online`);
    });

    client.on('message', async (eventInfo) => {
        if (eventInfo.content[0] === process.env.INVOKE_TAG) {
            let cmdQuery = eventInfo.content.substring(1);
            status = await actions.processAction(eventInfo, cmdQuery);
            eventInfo.channel.send(status[1]);
        }
        else {
            let cmdQuery = eventInfo.content;
            status = await actions.processNaturalLanguage(eventInfo, cmdQuery, process.env.BOT_NAME);
            if(status[0] != undefined)
                eventInfo.channel.send(status[1]);
        }
    });

    client.login(process.env.DISCORDJS_BOT_TOKEN);
});

