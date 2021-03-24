
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
            case ACTION_LIST.ADD.INVOKE_LIST.includes(cmd):
                if(parameter != undefined) {
                    this.player.play(message, parameter, true);
                    return ACTION_LIST.ADD.STATUS_HANDLE(parameter.toLowerCase(), message.author.username);
                }
                break;
            case ACTION_LIST.SKIP.INVOKE_LIST.includes(cmd):
                if(parameter == undefined) {
                    this.player.skip(message);
                    return ACTION_LIST.SKIP.STATUS_HANDLE(message.author.username);
                }
                break;
            case ACTION_LIST.EIGTH_D.INVOKE_LIST.includes(cmd):
                let filter = this.player.getQueue(message).filters;
                let flag = ACTION_LIST.EIGTH_D.STATUS_FLAG(parameter);
                filter['8D'] = flag;
                return ACTION_LIST.EIGTH_D.STATUS_HANDLE(flag);
        }

        return ACTION_LIST.ERROR.STATUS_HANDLE();
    }
    
    processNaturalLanguage(message, cmdQuery, botName) {
        // figure out if dj_bot is a subject
        cmdQuery = cmdQuery.toLowerCase();
        cmdQuery = cmdQuery.split("([.,!?:;'\"-]|\\s)+')");

        if(!cmdQuery.includes(botName))
            return ACTION_LIST.NULL.STATUS_HANDLE();

        let cmdRequested = undefined
        for(actionType in ACTION_LIST)
            console.log(actionType);
        return ACTION_LIST.NULL.STATUS_HANDLE();
        
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