const getJSON = require('get-json');
const data = require("./data.js");
let interval = "";
let discordmsgArray=[];
function LoopRoomMessages(message) {
    interval = setInterval(() => {
        SendRoomMessage(message);
    }, 2500);
}
exports.LoopRoomMessages = LoopRoomMessages;
function SendRoomMessage(message) {
    RoomMessage().then(function BobDoSomething(messageArray) {
        for (let i = messageArray.length; i < discordmsgArray.length; i++) {
            discordmsgArray[i].delete();
            discordmsgArray.splice(i, 1);
        }
        for (let i = 0; i < discordmsgArray.length; i++) {
            discordmsgArray[i].edit(messageArray[i]);
        }
        for (let i = discordmsgArray.length; i < messageArray.length; i++) {
            message.channel.send(messageArray[i]).then((m) => {
                discordmsgArray.push(m);
            });
        }
    }).catch((err) => {
        console.log(err);
    });
}
function RoomCount(){
    let url = `http://${data.serverIP}:${data.serverPort}/api/getrooms?&username=${data.serverUser}&pass=${data.serverPassword}`;
    return getJSON(url).then(function (response) {
        let msg = '';
        if (response != null) {
            return response.rooms.length;
        }
    }).catch(function (error) {
        console.log(error);
    });
}
function RoomMessage() {
    let url = `http://${data.serverIP}:${data.serverPort}/api/getrooms?&username=${data.serverUser}&pass=${data.serverPassword}`;
    console.log(url); 
    return getJSON(url).then(function (response) {
        let msg = '';
        if (response != null) {
            let rooms = response.rooms;
            for (let i in rooms) {
                let room = rooms[i];
                msg += `Duel Nr: ${i} ID: ${room.roomid} Name: ${room.roomname} `;
                let duelers = [];
                let watchers = [];
                for (let j in room.users) {
                    if (room.users[j].pos == 7) {
                        watchers.push(room.users[j]);
                    }
                    else {
                        duelers.push(room.users[j]);
                    }
                }
                msg += `\nPlayers: (${duelers.length})\n`;
                for (let d in duelers) {
                    msg += `${duelers[d].name} `;
                    if(duelers[d].ip!==null){
                        msg+=`IP: ${duelers[d].ip} `;
                    }
                    if(duelers[d].status!==null){
                        if(duelers[d].status.score>0){
                        msg+=`Wins: ${duelers[d].status.score} `;
                        }
                        msg+=`LP: ${duelers[d].status.lp} Cards: ${duelers[d].status.cards}`;
                    }
                    msg+="\n";
                }
                if (watchers.length > 0) {
                    msg += "\nViewers: ";
                    for (let w in watchers) {
                        msg += `${watchers[w].name} IP: ${watchers[w].ip} `;
                    }
                }
                msg += "\nStatus of the game: " + room.istart + "\n\n";
            }
            /**
             * @type {string[]}
             */
            let arr = [];
            let maxLength = 2000; //max message size for discord.
            do {
                if (msg.length > maxLength) {
                    let lastDuelID_pos = msg.substr(0, maxLength).lastIndexOf("Duel Nr:");
                    let messageSubstring = "\n" + msg.substr(0, lastDuelID_pos) + "\n";
                    arr.push(messageSubstring);
                    msg = msg.substr(lastDuelID_pos);
                }
                else {
                    arr.push(msg);
                    msg = [];
                }
            } while (msg.length != 0);
            return (arr);
        }
    }).catch(function (error) {
        console.log(error);
    });
}
function StopSendingRoomMessages(message) {
    if (interval != "") {
        clearInterval(interval);
        discordmsgArray = [];
        message.channel.send("Sorry, I'll stop editing those!");
    }
    else {
        console.log("Nothing to stop!");
    }
}
exports.RoomCount = RoomCount;
exports.StopSendingRoomMessages = StopSendingRoomMessages;