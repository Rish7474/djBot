
const { Queue } = require('discord-player');
const ACTION_LIST = require('./action_list.js');
const {spotifyHandler, parseSpotifyURI} = require('./spotify_handler.js');

class ActionHandler {
    constructor(player = {}) {
        this.player = player;
    }

    processAction(eventInfo, cmdQuery) {
        if(cmdQuery.length == 0)
            return ACTION_LIST.ERROR.STATUS_HANDLE();
    
        let cmd, parameter;
    
        [cmd, parameter] = this._getTokens(cmdQuery);
        cmd = cmd.toUpperCase();
        switch(true) {
            
            case ACTION_LIST.ADD.INVOKE_LIST.includes(cmd) || ACTION_LIST.ADD.SHORTCUT_INVOKE.includes(cmd):
                if(parameter != undefined) {
                    this.player.play(eventInfo, parameter, true);
                    return ACTION_LIST.ADD.STATUS_HANDLE(parameter.toLowerCase(), eventInfo.author.username);
                }
                break;

            case ACTION_LIST.PLAYLIST.INVOKE_LIST.includes(cmd) || ACTION_LIST.PLAYLIST.SHORTCUT_INVOKE.includes(cmd):
                if(parameter != undefined) {
                    const playlistToken = parseSpotifyURI(parameter);
                    return spotifyHandler.getPlaylist(playlistToken).then(data => {
                        const playlist = data.body.tracks.items;
                        playlist.forEach(song => {
                            if(song.track != undefined && song.track != null) {
                                const songQuery = song.track.name + ' ' + song.track.artists[0].name;
                                this.player.play(eventInfo, songQuery, true);
                            }
                        });
                        return ACTION_LIST.PLAYLIST.STATUS_HANDLE(data.body.name, eventInfo.author.username);
                    }, err => { return ACTION_LIST.ERROR.STATUS_HANDLE();});
                }
                break;

            case ACTION_LIST.RADIO.INVOKE_LIST.includes(cmd) || ACTION_LIST.RADIO.SHORTCUT_INVOKE.includes(cmd):
                if(parameter != undefined) {        
                    const genre = parameter.toLowerCase();
                    spotifyHandler.getRecommendations({
                        seed_genres: [genre]
                    }).then(data => {
                        const recommendations = data.body.tracks;
                        recommendations.forEach(recommendation => {
                            const songQuery = recommendation.name + ' ' + recommendation.artists[0].name;
                            this.player.play(eventInfo, songQuery, true);
                        });
                    }, err => {});
                    return ACTION_LIST.RADIO.STATUS_HANDLE(genre);
                }
                break;

            case ACTION_LIST.SKIP.INVOKE_LIST.includes(cmd) || ACTION_LIST.SKIP.SHORTCUT_INVOKE.includes(cmd):
                this.player.skip(eventInfo);
                return ACTION_LIST.SKIP.STATUS_HANDLE(eventInfo.author.username);

            case ACTION_LIST.PAUSE.INVOKE_LIST.includes(cmd) || ACTION_LIST.PAUSE.SHORTCUT_INVOKE.includes(cmd):
                this.player.pause(eventInfo);
                return ACTION_LIST.PAUSE.STATUS_HANDLE(eventInfo.author.username);

            case ACTION_LIST.CLEAR.INVOKE_LIST.includes(cmd) || ACTION_LIST.CLEAR.SHORTCUT_INVOKE.includes(cmd):
                this.player.clearQueue(eventInfo);
                return ACTION_LIST.CLEAR.STATUS_HANDLE(eventInfo.author.username);

            case ACTION_LIST.RESUME.INVOKE_LIST.includes(cmd) || ACTION_LIST.RESUME.SHORTCUT_INVOKE.includes(cmd):
                this.player.resume(eventInfo);
                return ACTION_LIST.RESUME.STATUS_HANDLE(eventInfo.author.username);
            
            case ACTION_LIST.EIGTH_D.INVOKE_LIST.includes(cmd):
                let filter = this.player.getQueue(eventInfo).filters;
                let flag = ACTION_LIST.EIGTH_D.STATUS_FLAG(parameter);
                filter['8D'] = flag;
                return ACTION_LIST.EIGTH_D.STATUS_HANDLE(flag);
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
                if(actionType.INVOKE_LIST != undefined && actionType.INVOKE_LIST.includes(tokens[i])) {
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

};

module.exports = ActionHandler;