ACTION_LIST = {
    ADD:{
            TYPE: 'ADD',
            STATUS_HANDLE: (songName, user) => {
                return [0, `${songName} was added to the queue (requested by ${user})`];
            },
            INVOKE_LIST: ['A','ADD', 'P', 'PLAY', 'START']
    },
    SKIP:{
            TYPE: 'SKIP',
            STATUS_HANDLE: (user) => {
                return [0, `${user} skipped the current song`];
            },
            INVOKE_LIST: ['S', 'SKIP']
    }, 
    EIGTH_D:{
            TYPE: '8D',
            STATUS_HANDLE: (flag) => {
                if(flag)
                    return [0, '8D filter will be on for rest of the songs in the queue'];
                return [0, '8D filter will be off for rest of the songs in the queue'];
            },
            INVOKE_LIST: ['8D'],
            STATUS_FLAG: (switchInput) => {
                return switchInput == undefined || switchInput == 'ON';
            }
    },
    ERROR:{
            TYPE: 'ERROR',
            STATUS_HANDLE: () => {
                return [1, "The requested command is invalid"];
            },
            INVOKE_LIST: undefined
    },
    NULL:{
            TYPE: 'NULL',
            STATUS_HANDLE: () => {
                return [undefined, undefined]
            },
            INVOKE_LIST: undefined
    }
};

module.exports = ACTION_LIST;