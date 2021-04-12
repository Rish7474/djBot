ACTION_LIST = {
    ADD:{
            TYPE: 'CMD',
            STATUS_HANDLE: (songName, user) => {
                return Promise.resolve([0, `\`\`\`${songName} was added to the queue (requested by ${user})\`\`\``]);
            },
            INVOKE_LIST: ['ADD', 'PLAY'],
            SHORTCUT_INVOKE: ['A', 'P'],
            EXECUTE: (player, eventInfo, songQuery, spotifyPackage=undefined) => {
                if(songQuery) {
                    player.play(eventInfo, songQuery, true);
                    return ACTION_LIST.ADD.STATUS_HANDLE(songQuery.toLowerCase(), eventInfo.author.username);
                }
                return ACTION_LIST.ERROR.STATUS_HANDLE();
            }
    },
    PLAYLIST:{
            TYPE: 'CMD',
            STATUS_HANDLE: (playlistName, user) => {
                return Promise.resolve([0, `\`\`\`Playlist ${playlistName} was added to the queue (requested by ${user})\`\`\``]);
            },
            INVOKE_LIST: ['PLAYLIST'],
            SHORTCUT_INVOKE: ['PL'],
            EXECUTE: (player, eventInfo, playlistURI, spotifyPackage) => {
                let {spotifyHandler, parseSpotifyURI} = spotifyPackage;

                if(playlistURI) {
                    const playlistToken = parseSpotifyURI(playlistURI);

                    return spotifyHandler.getPlaylist(playlistToken).then(data => {
                        const playlist = data.body.tracks.items;
                        const playlistName = data.body.name;
                        playlist.forEach(song => {
                            if(song.track != undefined && song.track != null) {
                                const songQuery = `${song.track.name}  ${song.track.artists[0].name}`;
                                player.play(eventInfo, songQuery, true);
                            }
                        });
                        return ACTION_LIST.PLAYLIST.STATUS_HANDLE(playlistName, eventInfo.author.username);
                    }, err => { return ACTION_LIST.ERROR.STATUS_HANDLE(); });
                }

                return ACTION_LIST.ERROR.STATUS_HANDLE();
            }
    },   
    RADIO:{
            TYPE: 'CMD',
            STATUS_HANDLE: (genre) => {
                if(genre)
                    return Promise.resolve([0, `\`\`\`${genre} radio started\`\`\``]);
                return Promise.resolve([0, `\`\`\`radio started\`\`\``]);
            },
            INVOKE_LIST: ['RADIO'],
            SHORTCUT_INVOKE: ['RA'],
            EXECUTE: (player, eventInfo, genre, spotifyPackage) => {
                let {spotifyHandler, parseSpotifyURI} = spotifyPackage;

                let recommendationParam = {};
                if(genre != undefined)
                    recommendationParam = { seed_genres: [genre.toLowerCase()] };

                spotifyHandler.getRecommendations(recommendationParam).then(data => {
                    const recommendations = data.body.tracks;
                    recommendations.forEach(recommendation => {
                        const songQuery = `\`\`\`${recommendation.name}  ${recommendation.artists[0].name}\`\`\``;
                        player.play(eventInfo, songQuery, true);
                    });
                }, err => {} );

                return ACTION_LIST.RADIO.STATUS_HANDLE(genre);
            }
    },
    SKIP:{
            TYPE: 'CMD',
            STATUS_HANDLE: (user) => {
                return Promise.resolve([0, `\`\`\`${user} skipped the current song\`\`\``]);
            },
            INVOKE_LIST: ['SKIP'],
            SHORTCUT_INVOKE: ['S'],
            EXECUTE: (player, eventInfo, parameter=undefined, spotifyPackage=undefined) => {
                player.skip(eventInfo);
                return ACTION_LIST.SKIP.STATUS_HANDLE(eventInfo.author.username);
            }
    },
    PAUSE:{
            TYPE: 'CMD',
            STATUS_HANDLE: (user) => {
                return Promise.resolve([0, `\`\`\`${user} paused the song\`\`\``]);
            },
            INVOKE_LIST: ['HALT', 'PAUSE'],
            SHORTCUT_INVOKE: ['H', 'PS'],
            EXECUTE: (player, eventInfo, parameter=undefined, spotifyPackage=undefined) => {
                player.pause(eventInfo);
                return ACTION_LIST.PAUSE.STATUS_HANDLE(eventInfo.author.username);                
            }
    },
    CLEAR:{
        TYPE: 'CMD',
        STATUS_HANDLE: (user) => {
            return Promise.resolve([0, `\`\`\`${user} cleared the queue\`\`\``]);
        },
        INVOKE_LIST: ['DELETE', 'CLEAR'],
        SHORTCUT_INVOKE: ['CLS', 'DEL'],
        EXECUTE: (player, eventInfo, parameter=undefined, spotifyPackage=undefined) => {
            player.clearQueue(eventInfo);
            return ACTION_LIST.CLEAR.STATUS_HANDLE(eventInfo.author.username);
        }
    },
    RESUME:{
            TYPE: 'CMD',
            STATUS_HANDLE: (user) => {
                return Promise.resolve([0, `\`\`\`${user} resumed the song\`\`\``]);
            },
            INVOKE_LIST: ['START', 'RESUME'],
            SHORTCUT_INVOKE: ['R', 'ST'],
            EXECUTE: (player, eventInfo, parameter=undefined, spotifyPackage=undefined) => {
                player.resume(eventInfo);
                return ACTION_LIST.RESUME.STATUS_HANDLE(eventInfo.author.username);
            }
    },
    EIGTH_D:{
            TYPE: 'CMD',
            STATUS_HANDLE: (flag) => {
                if(flag)
                    return Promise.resolve([0, `\`\`\`8D filter will be on for rest of the songs in the queue\`\`\``]);
                return Promise.resolve([0, `\`\`\`8D filter will be off for rest of the songs in the queue\`\`\``]);
            },
            INVOKE_LIST: ['8D'],
            SHORTCUT_INVOKE: [],
            EXECUTE: (player, eventInfo, flag=undefined, spotifyPackage=undefined) => {
                let filter = player.getQueue(eventInfo).filters;
                flag = flag == undefined || flag.toUpperCase() == 'ON';
                filter['8D'] = flag;
                return ACTION_LIST.EIGTH_D.STATUS_HANDLE(flag);
            }
    },
    BAN:{
        TYPE: 'CMD',
        STATUS_HANDLE: (bannedUser, duration=undefined) => {
            if(duration == undefined) {
                return Promise.resolve([0, `\`\`\`${bannedUser} is banned indefinately!\`\`\``]);
            }
            return Promise.resolve([0, `\`\`\`${bannedUser} is banned for ${duration} minutes!\`\`\``]);
        },
        INVOKE_LIST: ['BAN'],
        SHORTCUT_INVOKE: [],
        EXECUTE: (username, duration, serverID, ban) => {
            ban(username, duration, serverID);
            return ACTION_LIST.BAN.STATUS_HANDLE(username, duration);                
        }
    },
    ERROR:{
            TYPE: 'STATE',
            STATUS_HANDLE: () => {
                return Promise.resolve([1, `\`\`\`The requested command is invalid\`\`\``]);
            },
            INVOKE_LIST: undefined,
            SHORTCUT_INVOKE: undefined,
            EXECUTE: undefined
    },
    BANNED:{
            TYPE: 'STATE',
            STATUS_HANDLE: (username) => {
                return Promise.resolve([1, `\`\`\`${username}, you are banned!\`\`\``]);
            },
            INVOKE_LIST: undefined,
            SHORTCUT_INVOKE: undefined,
            EXECUTE: undefined
    },
    NULL:{
            TYPE: 'NULL',
            STATUS_HANDLE: () => {
                return Promise.resolve([undefined, undefined])
            },
            INVOKE_LIST: undefined,
            SHORTCUT_INVOKE: undefined,
            EXECUTE: undefined
    }
};

module.exports = ACTION_LIST;