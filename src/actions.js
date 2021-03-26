
const ACTION_LIST = require('./action_list.js');

class ActionHandler {
    constructor(player = {}) {
        this.player = player;
    }

    processAction(message, cmdQuery) {
        if(cmdQuery.length == 0)
            return ACTION_LIST.ERROR.STATUS_HANDLE();
    
        cmdQuery = cmdQuery.toUpperCase();
        let cmd, parameter;
    
        [cmd, parameter] = this._getTokens(cmdQuery);

        switch(true) {
            case ACTION_LIST.ADD.INVOKE_LIST.includes(cmd) || ACTION_LIST.ADD.SHORTCUT_INVOKE.includes(cmd):
                if(parameter != undefined) {
                    this.player.play(message, parameter, true);
                    return ACTION_LIST.ADD.STATUS_HANDLE(parameter.toLowerCase(), message.author.username);
                }
                break;

            case ACTION_LIST.SKIP.INVOKE_LIST.includes(cmd) || ACTION_LIST.SKIP.SHORTCUT_INVOKE.includes(cmd):
                this.player.skip(message);
                return ACTION_LIST.SKIP.STATUS_HANDLE(message.author.username);

            case ACTION_LIST.PAUSE.INVOKE_LIST.includes(cmd) || ACTION_LIST.PAUSE.SHORTCUT_INVOKE.includes(cmd):
                this.player.pause(message);
                return ACTION_LIST.PAUSE.STATUS_HANDLE(message.author.username);

            case ACTION_LIST.RESUME.INVOKE_LIST.includes(cmd) || ACTION_LIST.RESUME.SHORTCUT_INVOKE.includes(cmd):
                this.player.resume(message);
                return ACTION_LIST.RESUME.STATUS_HANDLE(message.author.username);
            
            case ACTION_LIST.EIGTH_D.INVOKE_LIST.includes(cmd):
                let filter = this.player.getQueue(message).filters;
                let flag = ACTION_LIST.EIGTH_D.STATUS_FLAG(parameter);
                filter['8D'] = flag;
                return ACTION_LIST.EIGTH_D.STATUS_HANDLE(flag);
        }

        return ACTION_LIST.ERROR.STATUS_HANDLE();
    }
    
    processNaturalLanguage(message, cmdQuery, botName) {
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
                if(actionType.INVOKE_LIST != undefined && actionType.INVOKE_LIST.includes(tokens[i])) {
                    commandStatus = this.processAction(message, tokens.slice(i).join(' '));
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
};

module.exports = ActionHandler;