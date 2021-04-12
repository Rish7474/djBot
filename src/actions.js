
const { Queue } = require('discord-player');
const ACTION_LIST = require('./action_list.js');
const SPOTIFY_PACKAGE = require('./spotify_handler.js');
const {isBanned, ban} = require('./db_manager.js');

class ActionHandler {
    constructor(player = {}) {
        this.player = player;
    }

    async processAction(eventInfo, cmdQuery) {
        if(await isBanned(eventInfo.guild.id, eventInfo.author.username))
            return ACTION_LIST.BANNED.STATUS_HANDLE(eventInfo.author.username);

        let cmd, parameter;
        [cmd, parameter] = this._getTokens(cmdQuery);
        cmd = cmd.toUpperCase();

        if(ACTION_LIST.BAN.INVOKE_LIST.includes(cmd)) {
            let username, duration;
            [username, duration] = this._getTokens(parameter);
            if(this._isAdmin(eventInfo)) {
                return ACTION_LIST.BAN.EXECUTE(username, duration, eventInfo.guild.id, ban);
            }
            else {
                return ACTION_LIST.BAN.EXECUTE(eventInfo.author.username, 1, eventInfo.guild.id, ban);
            }
        }

        const actionTypes = Object.values(ACTION_LIST);
        for(let actionType of actionTypes) {
            if(actionType.TYPE == 'CMD' &&
                (actionType.INVOKE_LIST.includes(cmd) || actionType.SHORTCUT_INVOKE.includes(cmd))) {
                    return actionType.EXECUTE(this.player, eventInfo, parameter, SPOTIFY_PACKAGE);
                }
        }

        return ACTION_LIST.ERROR.STATUS_HANDLE();
    }
    
    processNaturalLanguage(eventInfo, cmdQuery, botName) {
        // make the string into uppercase and remove all puncutions
        const punctRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
        const spaceRegex = /\s+/;
        cmdQuery = cmdQuery.toUpperCase();
        cmdQuery = cmdQuery.replace(punctRegex, '');
        const tokens = cmdQuery.split(spaceRegex);
        
        const nameIndex = tokens.indexOf(botName);
        let commandStatus = undefined;

        if(nameIndex == -1)
            return ACTION_LIST.NULL.STATUS_HANDLE();

        const actionTypes = Object.values(ACTION_LIST);
        for(let i = nameIndex+1; i < tokens.length && commandStatus == undefined; i++) {
            for(const actionType of actionTypes)
                if(actionType.TYPE == 'CMD' && actionType.INVOKE_LIST.includes(tokens[i])) {
                    commandStatus = this.processAction(eventInfo, tokens.slice(i).join(' '));
                    break;
                }
        }

        if(commandStatus == undefined)
            return ACTION_LIST.NULL.STATUS_HANDLE();
        return commandStatus;
    }

    _getTokens(query) {
        if(query.length == 0)
            return [undefined, undefined];
    
        let cmd = undefined;
        let parameter = undefined;
    
        let index = 0;
    
        // get the first word (command)
        while(index < query.length && query[index] != ' ')
            index++;
    
        cmd = query.substring(0,index);
        parameter = query.replace(cmd, '').trim();
    
        if(parameter == undefined || parameter.length == 0)
            return [cmd, undefined];
        
        return [cmd, parameter];
        
    };

    _isAdmin(eventInfo) { return eventInfo.author.username == 'bhasker' || eventInfo.guild.onwerID == eventInfo.author.id; }
};

module.exports = ActionHandler;