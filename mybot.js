'use strict';
const Discord = require("discord.js");
const client = new Discord.Client();
const compressing = require('compressing').zip;
let exec = require('child_process').exec;
let spawn = require('child_process').spawn;
let commands = require("./commands/commands.js");
let data = require("./data.js");
let stop = true;
let password = data.psswd;
const prefix = data.token;
client.on("ready", () => {
    console.log("I am ready!");
    client.channels.get("512392350933450767").send(client.emojis.random(2).toString() + "\nOther Bots outdated.\nPiBot activated!\n" + client.emojis.random(2).toString());
});

client.on("message", (message) => {
    let admin = false;
    if (message.content.toLowerCase().includes("u stupid") || message.content.toLowerCase().includes("baka")) {
        message.channel.send("<@" + message.author.id + ">" + " No U!");
    }
    if (message.content.toLowerCase().includes("http") || message.attachments.array().length > 0) {
        message.react('👌').then(() => {
            message.react("😂").then(() => {
                message.react('💯').then(() => {
                    if (message.channel.type == 'text') {
                        message.react(client.emojis.random());
                        message.react(client.emojis.random());
                        message.react(client.emojis.random());
                        message.react(client.emojis.random());
                    }

                })
            })
        });
    }
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }
    let authorID = (message.author.id == data.szefoID || message.author.id == data.soulstealerID);
    if (authorID) {
        admin = true;
    } else {
        admin = false;
    }
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    //non-admin commands
    if (command === 'help') {
        message.channel.send("Available Commands:\n!id\n!ping\n!reee\n!rape\n!get-duellog\n!get-deckssave\n!dl linkToTheFile nameOfTheFile\n!restart-Server\n!clearchat <val> (max 99)\n!update-Scripts\n!update-YgoPro\n!update-Windbot\n!restart-Pi\n!update-Bot\n!dashboard\n!getcurrentrooms\n!stop - turns off !getcurrentrooms\n!badbot\n");
    }
    if (command === 'id') {
        message.channel.send(message.author.id);
        return;
    }
    if (command === 'ping') {
        message.channel.send("pong!");
        return;
    }
    if (command === 'rape') {
        message.channel.send("N-No... Don't! Yamete Kudasai Senpai!!");
    }
    if (command === "get-deckssave") {
        compressing.compressDir('/home/pi/server/ygopro-server/decks_save', '/media/pi/usb/decks_save.zip')
            .then(() => {
                message.channel.send("Your decks_save.zip: ", {
                    files: ["/media/pi/usb/decks_save.zip"]
                })
            })
            .catch();
    }
    if (command === "get-duellog") {
        compressing.compressFile('/home/pi/server/ygopro-server/config/duel_log.json', '/media/pi/usb/duel_log.zip')
            .then(() => {
                message.channel.send("Your duel-log.zip: ", {
                    files: ["/media/pi/usb/duel_log.zip"]
                })
            })
            .catch((reason) => {
                message.channel.send("Something went wrong preparing duel_log.zip\n" + reason)
            });
    }
    if (command === "reee") {

        message.channel.send("Relax " + client.emojis.random(2).toString());
    }

    if (admin) {
        //admin commands
        switch (command) {
            case 'dl':
                {
                    Download(args, message);
                    break;
                }

            case 'restart-server':
                {
                    message.channel.send("restarting the server!");
                    console.log(commands.restartServer);
                    exec(commands.restartServer);
                    break;
                }

            case 'update-scripts':
                {
                    message.channel.send("Updating Server Scripts and databases!");
                    console.log(commands.updateScript);
                    exec(commands.updateScript, {
                        'maxBuffer': 800 * 1024
                    });
                    break;
                }

            case 'update-ygopro':
                {
                    message.channel.send("Updating YgoPro!");
                    console.log(commands.updateYgoPro);
                    let comm = exec(commands.updateYgoPro, {
                        'maxBuffer': 800 * 1024
                    }, function (stdout) {
                        console.log(`child stdout:\n${stdout}`);
                    });
                    break;
                }

            case 'update-windbot':
                {
                    message.channel.send("Updating Windbot!");
                    console.log(commands.updateWindbot);
                    exec(commands.updateWindbot, {
                        'maxBuffer': 800 * 1024
                    });
                    break;
                }

            case 'restart-pi':
                {
                    message.channel.send("Restarting Pi!");
                    exec(commands.restartPi);
                    break;
                }

            case 'update-bot':
                {
                    message.channel.send("BeepBoop Updating myself!")
                    exec(commands.updateBot);
                    break;
                }

            case 'stop':
                {
                    if (stop == false) {
                        stop = true;
                        message.channel.send("Sorry, I'll stop editing those!");
                    }
                    break;
                }

            case 'getcurrentrooms':
                {
                    SendCurrentRooms(message);
                    break;
                }

            case 'dashboard':
                {
                    ShowDasboard(message);
                    break;
                }

            case 'clearchat':
                {
                    DeleteMessages(message, args);
                    break;
                }

            case 'badbot':
                {
                    message.channel.send("Przepraszam. " + client.emojis.random());
                    exec("sudo pm2 restart mybot");
                    break;
                }

            default:
                {
                    return;
                }
        }
    }
    return;
});

function ShowDasboard(message) {
    let dashboard = spawn('./list.sh');
    dashboard.stdout.on('data', (data) => {
        message.channel.send(`\n${data}`);
    });
    dashboard.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
    });
    dashboard.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
    });
}

async function DeleteMessages(message, args) {
    message.delete();
    if (args[0] > 99) {
        args[0] == 99;
    }
    try {
        const fetched = await message.channel.fetchMessages({
            limit: args[0]
        });
        console.log(fetched.size + ' messages found, deleting...');
        message.channel.bulkDelete(fetched).catch(error => message.channel.send("Error: " + error));
    } catch {
        message.channel.send("Przykro mi, ale nie mogę tego dla Ciebie zrobić. " + client.emojis.random());

    }
}
/**
 * @returns {string[]} Array of message strings
 */
function CurrentRoomsMessage() {
    let getJSON = require('get-json');
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
                    } else {
                        duelers.push(room.users[j]);
                    }
                }
                msg += "\nPlayers: "
                for (let d in duelers) {
                    msg += `${duelers[d].name} `
                }
                if (watchers.length > 0) {
                    msg += "\nViewers: "
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
                } else {
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

function Download(args) {
    let dlLink = args[0];
    let name;
    let path;
    if (args[1].includes("/")) {
        name = args[1].split("/").pop();
        path = args[1].split("/", 1);
        let mkdircmd = `mkdir -m777 /media/pi/usb/filmy/${path}`;
        exec(mkdircmd);
        path += "/";
    } else {
        name = args[1];
    }
    if (typeof dlLink !== 'undefined') {
        if (typeof name !== 'undefined') {
            let command = `wget -q -c -O /media/pi/usb/filmy/${path}${name} '${dlLink}'`
            message.channel.send(`Started downloading ${name}`);
            console.log(command)
            let download = exec(command /*,{'maxBuffer':1000*1024}*/ );
            download.on('error', (error) => {
                message.channel.send(`Error downloading ${name} from ${dlLink}.\n${error}`);
                return;
            });
            download.on('close', function (code, signal) {
                if (code === 0) {
                    message.channel.send(`Download ${name} from link ${dlLink} Completed.`);
                } else {
                    message.channel.send(`Download ${name} from link ${dlLink} was interrupted.`);
                }
            });
        } else {
            let command = `wget -q -c -P /media/pi/usb/filmy/ '${dlLink}'`
            console.log(command);
            let download = exec(command /*,{'maxBuffer':1000*1024}*/ );
            message.channel.send(`Started downloading ${dlLink}`);
            download.on('error', (error) => {
                message.channel.send(`Error downloading from ${dlLink}.\n${error}`);
                return;
            });
            download.on('close', function (code, signal) {
                if (code === 0) {
                    message.channel.send(`Download from link ${dlLink} Completed.`);
                } else {
                    message.channel.send(`Download from link ${dlLink} was interrupted.`);
                }
            });
        }
    } else {
        message.channel.send("Wrong download link!\nUse !dl Link Name or !dl Link");
    }
}

function SendCurrentRooms(message) {
    stop = false;
    let discordmsgArray = [];
    CurrentRoomsMessage().then(function (messageArray) {
        for (let msg of messageArray) {
            message.channel.send(msg).then((m) => {
                discordmsgArray.push(m);
            });
        }

    }).catch((err) => {
        console.log(err)
    });
    //edit messages

    let interval = setInterval(() => {
        if (!stop) {
            CurrentRoomsMessage().then(function (messageArray) {
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
                console.log(err)
            });
        } else {


            for (let discMsg of discordmsgArray) {
                discMsg.delete();
            }
            clearInterval(interval);
            return;
        }
    }, 2500);
}

client.login(password);