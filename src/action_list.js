ACTION_LIST = {
    ADD:{
            TYPE: 'ADD',
            STATUS_HANDLE: (songName, user) => {
                return Promise.resolve([0, `${songName} was added to the queue (requested by ${user})`]);
            },
            INVOKE_LIST: ['ADD', 'PLAY'],
            SHORTCUT_INVOKE: ['A', 'P']
    },
    PLAYLIST:{
            TYPE: 'PLAYLIST',
            STATUS_HANDLE: (playlistName, user) => {
                return Promise.resolve([0, `Playlist ${playlistName} was added to the queue (requested by ${user})`]);
            },
            INVOKE_LIST: ['PLAYLIST'],
            SHORTCUT_INVOKE: ['PL']
    },   
    RADIO:{
            TYPE: 'RADIO',
            STATUS_HANDLE: (genre) => {
                if(genre != undefined)
                    return Promise.resolve([0, `${genre} genre radio started`]);
                return Promise.resolve([0, `radio started`]);
            },
            INVOKE_LIST: ['RADIO'],
            SHORTCUT_INVOKE: ['RA']
    },
    SKIP:{
            TYPE: 'SKIP',
            STATUS_HANDLE: (user) => {
                return Promise.resolve([0, `${user} skipped the current song`]);
            },
            INVOKE_LIST: ['S', 'SKIP'],
            SHORTCUT_INVOKE: ['S']
    },
    PAUSE:{
            TYPE: 'PAUSE',
            STATUS_HANDLE: (user) => {
                return Promise.resolve([0, `${user} paused the song`]);
            },
            INVOKE_LIST: ['HALT', 'PAUSE'],
            SHORTCUT_INVOKE: ['H', 'PS']
    },
    CLEAR:{
        TYPE: 'CLEAR',
        STATUS_HANDLE: (user) => {
            return Promise.resolve([0, `${user} cleared the queue`]);
        },
        INVOKE_LIST: ['DELETE', 'CLEAR'],
        SHORTCUT_INVOKE: ['CLS', 'DEL']
    },
    RESUME:{
            TYPE: 'RESUME',
            STATUS_HANDLE: (user) => {
                return Promise.resolve([0, `${user} resumed the song`]);
            },
            INVOKE_LIST: ['START', 'RESUME'],
            SHORTCUT_INVOKE: ['R', 'ST']
    },
    EIGTH_D:{
            TYPE: '8D',
            STATUS_HANDLE: (flag) => {
                if(flag)
                    return Promise.resolve([0, '8D filter will be on for rest of the songs in the queue']);
                return Promise.resolve([0, '8D filter will be off for rest of the songs in the queue']);
            },
            INVOKE_LIST: ['8D'],
            SHORTCUT_INVOKE: undefined,
            STATUS_FLAG: (switchInput) => {
                switchInput = switchInput.toUpperCase();
                return switchInput == undefined || switchInput == 'ON';
            }
    },
    ERROR:{
            TYPE: 'ERROR',
            STATUS_HANDLE: () => {
                return Promise.resolve([1, "The requested command is invalid"]);
            },
            INVOKE_LIST: undefined,
            SHORTCUT_INVOKE: undefined
    },
    NULL:{
            TYPE: 'NULL',
            STATUS_HANDLE: () => {
                return Promise.resolve([undefined, undefined])
            },
            INVOKE_LIST: undefined,
            SHORTCUT_INVOKE: undefined
    }
};

module.exports = ACTION_LIST;