require('dotenv').config();

const firebase = require('firebase');
const { content } = require('googleapis/build/src/apis/content');
let firebaseApp = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const bannedDB = firebase.database().ref('bannedLists');

async function isBanned(serverID, username) {
    let banned = false;
    await bannedDB.once('value', snapshot => {
        bannedList = snapshot.val();
        if(bannedList != null && serverID in bannedList)
            banned = username.toUpperCase() in bannedList[serverID];
    });
    return banned;
};

function ban(username, duration=undefined, serverID){
    let serverList = bannedDB.child(serverID);

    if(duration == undefined) {
        duration = -1
    } 
    else{
        const now = new Date()  
        duration = Math.round(now.getTime() / 1000) + duration * 60
    } 
    serverList.child(username.toUpperCase()).set(duration);
};

function unban(username, serverID) {
    bannedDB.once('value', snapshot => {
        let bannedLists = snapshot.val();
        if(bannedList == null)
            return;
        if(serverID in bannedList && username.toUpperCase() in bannedLists[serverID]){
            let unbannedRef = bannedDB.child(serverID).child(username.toUpperCase());
            unbannedRef.remove();
        }
        
    }) ; 
};

setInterval(() => {
    bannedDB.once('value', snapshot => {
        bannedLists = snapshot.val();
        if(bannedLists == null)
            return;
        let servers = Object.keys(bannedLists);
        for(let server of servers) {
            let bannedUsers = Object.keys(bannedLists[server]);
            for(let bannedUser of bannedUsers){
                if(bannedLists[server][bannedUser] != -1 && bannedLists[server][bannedUser] <= Math.round(Date.now() / 1000)){
                    let unbannedRef = bannedDB.child(server).child(bannedUser);
                    unbannedRef.remove();
                }
            }
        }
    });
}, 60000);

module.exports = {isBanned, ban, unban};