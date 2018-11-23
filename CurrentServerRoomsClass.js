'use strict';
let data = require("./data.js");
let getJSON = require('get-json');
class CurrentServerRooms {
    constructor(message) {
        this.message = message;
        this.discordmsgArray = [];
        this.interval = "";
    }
    /**
     * @returns {string[]}
     */
    Message() {
        let url = `http://${data.serverIP}:${data.serverPort}/api/getrooms?&pass=${data.serverPassword}`;
        return getJSON(url).then(function (response) {
            let msg = '';
            if (response != null) {
                let rooms = response.rooms;
                for (let i in rooms) {
                    let room = rooms[i];
                    msg += `Duel ID: ${i} Name: ${room.roomname} `;
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
                    msg += "\nPlayers: ";
                    for (let d in duelers) {
                        msg += `${duelers[d].name} `;
                    }
                    if (watchers.length > 0) {
                        msg += "\nViewers: ";
                        for (let w in watchers) {
                            msg += `${watchers[w].name}  `;
                        }
                    }
                    msg += "\nStatus of the game: " + room.istart + "\n\n";
                }
                /**
                 * @type {string[]}
                 */
                let arr = [];
                getJSON = require('get-json');
                let maxLength = 2000; //max message size for discord.
                do {
                    if (msg.length > maxLength) {
                        let lastDuelID_pos = msg.substr(0, maxLength).lastIndexOf("Duel ID:");
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
    LoopMessages() {
        let obj = this;
        this.interval = setInterval(() => {
            this.Send(obj);
        }, 2500);
    }
    Send(obj) {
        obj.Message().then(function (messageArray) {
            for (let i = messageArray.length; i < obj.discordmsgArray.length; i++) {
                obj.discordmsgArray[i].delete();
                obj.discordmsgArray.splice(i, 1);
            }
            for (let i = 0; i < obj.discordmsgArray.length; i++) {
                obj.discordmsgArray[i].edit(messageArray[i]);
            }
            for (let i = obj.discordmsgArray.length; i < messageArray.length; i++) {
                obj.message.channel.send(messageArray[i]).then((m) => {
                    obj.discordmsgArray.push(m);
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    StopSending() {
        if (this.interval != "") {
            for (let discMsg of this.discordmsgArray) {
                discMsg.delete();
            }
            clearInterval(this.interval);
            this.interval = "";
            this.message.channel.send("Sorry, I'll stop editing those!");
        }
    }
}
exports.CurrentServerRooms = CurrentServerRooms;