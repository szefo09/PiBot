const {
    StopSendingRoomMessages,
    LoopRoomMessages,
    RoomCount
} = require("./RoomMessageFunctions");
'use strict';
const Discord = require("discord.js");
const client = new Discord.Client();
const commands = require("./commands/commands.js");
const data = require("./data.js");
const getJSON = require('get-json');
const compressing = require('compressing').zip;
const moment = require('moment');
let Embed = new Discord.RichEmbed();
let exec = require('child_process').exec;
let execSync = require('child_process').execSync;
let spawn = require('child_process').spawn;
const fs = require("fs");
let stream;
exports.discordmsgArray = [];
exports.interval = "";
let password = data.psswd;
const prefix = data.token;
client.on("ready", () => {
    console.log("I am ready!");
    client.channels.get("512392350933450767").send(client.emojis.random(2).toString() + "\nOther Bots outdated.\nPiBot activated!\n" + client.emojis.random(2).toString());
    client.user.setActivity(`sesje DnD~`, {
        url: "http://srvpro.ygo233.com/dashboard-en.html",
        type: "WATCHING"
    });
});

client.on("message", (message) => {
    let admin = false;
    // if (message.content.toLowerCase().includes("u stupid") || message.content.toLowerCase().includes("baka")) {
    //     message.channel.send("<@" + message.author.id + ">" + " No U!");
    // }
    // if (message.content.toLowerCase().includes("http") || message.attachments.array().length > 0) {
    //     for (let z = 0; z <= Math.floor(Math.random() * 8) + 3; z++) {
    //         message.react(client.emojis.random());
    //     }
    // }
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
        message.channel.send("Available Commands:\n!sesja - info kiedy nastepna sesja D&D\n!nowasesja - ustaw datę nowej sesji D&D (podaj po komendzie).\n!lb amount (converts pounds to kg)\n!ft feet inches (converts ft to meters or feet and inches to meters)\n!d dice amount\n!id\n!ping\n!reee\n!rape\n!get-temp\n!shout (Shouts a message to the ygopro server)\n!get-duellog\n!get-deckssave\n!dl linkToTheFile nameOfTheFile\n!restart-Server\n!clearchat <val> (max 99)\n!update-Scripts\n!update-YgoPro\n!update-Windbot\n!restart-Pi\n!update-Bot\n!dashboard\n!getcurrentrooms\n!stop - turns off !getcurrentrooms\n!badbot\n!backup-data\n!wiggle\n");
        return;
    }
    if (command === 'id') {
        message.channel.send(message.author.id);
        return;
    }
    if (command === 'wiggle') {
        ShowEmbed(message);
        return;
    }
    if (command === `sesja`) {
        let msg;
        fs.readFile("nowaSesja.txt", "utf-8", (err, data) => {
            if (err) {
                message.channel.send("brak ustawionej nowej sesji.")
            }
            msg = data;
            if (msg != null) {
                message.channel.send(`Następna sesja: ${msg}`);
            }
        })
        return;
    }
    if (command === 'd') {
        let dice = args[0];
        let amount = args[1];
        if (isNaN(dice)) {
            return;
        }
        if (dice <= 0) {
            return;
        }
        if (isNaN(amount)) {
            let result = Math.floor(Math.random() * dice) + 1;
            if (isNaN(result)) {
                return;
            }
            message.channel.send(`🎲 Result of ${message.author.username}'s D${dice}: ${result} 🎲`);
        } else {
            if (amount <= 0) {
                return;
            }
            let result = [];
            for (let i = 0; i < amount; i++) {
                result.push(Math.floor(Math.random() * dice) + 1);
                if (isNaN(result[i])) {
                    return;
                }
            }
            message.channel.send(`🎲 Result of ${message.author.username}'s ${amount} D${dice}s: ${result.join(", ")} (Sum: ${result.reduce((a,b)=> a+b)})🎲`);
        }
        return;
    }

    if (command === 'ft') {
        let feet = args[0];
        let inch = args[1];

        if (isNaN(feet)) {
            return;
        }

        if (isNaN(inch)) {
            let meters = roundToTwo(feet * 0.3048);
            message.channel.send(`${feet}ft equals ${meters}m ♿`);
        } else {
            let meters = roundToTwo(feet * 0.3048);
            let centimeters = roundToTwo((inch * 2.54) / 100);
            let result = roundToTwo(meters + centimeters);
            message.channel.send(`${feet}ft ${inch}in equals ${result}m ♿`);
        }

        return;
    }

    if (command === 'lb') {
        let pound = args[0];

        if (isNaN(pound)) {
            return;
        }
        let kilograms = roundToTwo(pound * 0.45359237);
        message.channel.send(`${pound}lb equals ${kilograms}kg ⚖️`);
        return;
    }

    if (command === 'ping') {
        message.channel.send("pong!");
        return;
    }
    if (command === 'rape') {
        message.channel.send("N-No... Don't! Yamete Kudasai Senpai!!");
        return;
    }
    if (command === "get-deckssave") {
        compressing.compressDir('/media/pi/usb/decks_save', '/media/pi/usb/decks_save.zip')
            .then(() => {
                message.channel.send("Your decks_save.zip: ", {
                    files: ["/media/pi/usb/decks_save.zip"]
                })
            })
            .catch();
        // zip('/home/pi/server/ygopro-server/decks_save', '/media/pi/usb/decks_save.zip', (err) => {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        //     message.channel.send("Your decks_save.zip: ", {
        //         files: ["/media/pi/usb/decks_save.zip"]
        //     })
        // })
        return;
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
        // zip('/home/pi/server/ygopro-server/config/duel_log.json', '/media/pi/usb/duel_log.zip', (err) => {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        //     message.channel.send("Your duel-log.zip: ", {
        //         files: ["/media/pi/usb/duel_log.zip"]
        //     })
        // })
        return;
    }
    if (command === "reee") {

        message.channel.send("Relax " + client.emojis.random(2).toString());
        return;
    }
    if (command === "get-temp") {
        GetTemperatureOfThePi().then((temp) => {
            message.channel.send(temp);
            return;
        });
    }

    if (admin) {
        //admin commands
        switch (command) {
            case 'update-pi': {
                execSync('sudo apt-get update');
                execSync('sudo apt-get upgrade -y');
                message.channel.send(`installing updates`);
                return;
            }
            case 'stream': {
                ProcessStreamRequest(message, args);
                break;
            }
            case 'endstream': {
                if(stream){
                    stream.kill();
                }
                message.channel.send("Stream closed.");
                return;
            }
            case 'dl': {
                Download(message, args);
                break;
            }

            case 'restart-server': {
                message.channel.send(`restarting the server in ${args[0]} minutes!`);
                RestartServer(message, args);
                console.log(commands.restartServer);
                break;
            }

            case 'update-scripts': {
                message.channel.send("Updating Server Scripts and databases!");
                console.log(commands.updateScript);
                exec(commands.updateScript, {
                    'maxBuffer': 800 * 1024
                });
                break;
            }

            case 'update-ygopro': {
                message.channel.send("Updating YgoPro!");
                console.log(commands.updateYgoPro);
                let comm = exec(commands.updateYgoPro, {
                    'maxBuffer': 800 * 1024
                }, function (stdout) {
                    console.log(`child stdout:\n${stdout}`);
                });
                break;
            }

            case 'update-windbot': {
                message.channel.send("Updating Windbot!");
                console.log(commands.updateWindbot);
                exec(commands.updateWindbot, {
                    'maxBuffer': 800 * 1024
                });
                break;
            }

            case 'restart-pi': {
                message.channel.send("Restarting Pi!");
                exec(commands.restartPi);
                break;
            }
            case 'shout': {
                Shout(message, args);
                break;
            }

            case 'update-bot': {
                message.channel.send("BeepBoop Updating myself!")
                exec(commands.updateBot);
                break;
            }

            case 'stop': {
                StopSendingRoomMessages(message);
                break;
            }

            case 'getcurrentrooms': {
                LoopRoomMessages(message);
                break;
            }

            case 'dashboard': {
                ShowDashboard(message);
                break;
            }

            case 'clearchat': {
                DeleteMessages(message, args);
                break;
            }

            case 'badbot': {
                message.channel.send("Przepraszam. " + client.emojis.random());
                exec("sudo pm2 restart mybot");
                break;
            }

            case 'nowasesja': {
                let data = args.join(" ")
                fs.writeFile("nowaSesja.txt", data, (err) => {
                    if (err) console.log(err);
                    message.channel.send(`<@&729696773509087306> Data nowej sesji: ${data}`);
                });
                break;
            }

            case 'backup-data': {
                var date = moment().format("DD_MM_YY").toString();
                var optionsConfig = {
                    cwd: "/home/pi/server/ygopro-server/config",
                    env: process.env
                }
                var optionsMain = {
                    cwd: "/media/pi/usb",
                    env: process.env
                }
                exec("sudo pm2 stop ygopro-server");
                exec(`zip -qr /home/ftpuser/backup/replays/replays_${date}.zip current_replays`, optionsMain).on('exit', () => {
                    exec(`zip -qr /media/pi/usb/replays/replays_${date}.zip current_replays`, optionsMain).on('exit', () => {
                        exec(`cd current_replays && find -maxdepth 1 -name "*.yrp" -delete`, optionsMain)
                        console.log(`backup replays${date}`);
                        exec(`zip -qr /home/ftpuser/backup/decks_saves/decks_save_${date}.zip decks_save`, optionsMain).on("exit", () => {
                            exec(`zip -qr /media/pi/usb/deckssaves/decks_save_${date}.zip decks_save`, optionsMain).on('exit', () => {
                                exec(`cd decks_save && find -maxdepth 1 -name "*.ydk" -delete`, optionsMain);
                                console.log(`backup decks_save${date}`);
                                exec(`zip -qr /home/ftpuser/backup/duel_logs/duel_log${date}.zip duel_log.json`, optionsConfig).on('exit', () => {
                                    exec(`cp duel_log.json /media/pi/usb/duel_logs/duel_log${date}.json`, optionsConfig).on('exit', () => {
                                        exec("rm -rf duel_log.json", optionsConfig).on('exit', () => {
                                            console.log(`backup duel_log${date}.json`);
                                            console.log("restart server.");
                                            message.channel.send("Backup successful!")
                                            exec("sudo pm2 restart all");
                                        });

                                    });
                                });
                            });

                        });
                    });
                });
            }

            default: {
                return;
            }
        }
        return;
    }
    return;
});
client.on("error", (err) => {
    process.exit(0)
});
/**
 * @returns string
 */
async function GetTemperatureOfThePi() {
    let com = commands.getPiTemp;
    let temp = spawn(com.command, com.property);
    /**
     * @type {string} value
     */
    for await (let data of temp.stdout) {
        return `\n${data}`.replace("temp=", "🌡️ Temperature of the Pi=");
    }

}

function ProcessStreamRequest(message, args) {
    try {
        if (typeof (args) == "undefined" || typeof (args[0]) == "undefined") {
            let laststream;
            fs.readFile("lastStream.txt", "utf-8", (err, data) => {
                if (err) {
                    message.channel.send("No URL provided!");
                }
                laststream = data;
                if (laststream != null) {
                    message.channel.send(`No URL provided! Launching last streamed URL: ${laststream}`);
                    let args = laststream.split(" ");
                    LaunchVideo(args[0], args[1], message);
                    return;
                }
            })
            return;
        }
        if (args[0] == "end") {
            if (stream != null) {
                stream.kill();
                message.channel.send("Ended the stream.");
            } else {
                message.channel.send("No stream to end.");
            }
            return;
        }
        if (args[0].match(/https\:\/\/twitch\.tv\/\S{1,}$/)) {
            message.channel.send("valid twitch URL");
        }
        if (args[0].match(/https\:\/\/www\.youtube\.com\/watch\?v\=\S{1,}$/)) {
            message.channel.send("valid YT URL");
        }
        if (args[0].match(/\S{3,}/)) {
            const twitchURL = "https://twitch.tv/";
            args[0] = twitchURL + args[0];
            message.channel.send(`Possible Twitch name found, creating URL: ${args[0]}`);
        }
        let quality = "best";
        let videoURL = args[0];
        if (typeof (args[1]) !== "undefined") {
            quality = args[1];
        }
        let streamData = `${videoURL} ${quality}`;
        fs.writeFile("lastStream.txt", streamData, (err) => {
            if (err) console.log(err);
        });
        LaunchVideo(videoURL, quality, message);
    } catch (err) {
        message.channel.send(err);
    }

}

function LaunchVideo(url, quality, message) {
    if(stream){
        stream.kill();
    }
    stream = spawn('streamlink', [`${url}`, `${quality}`, `--config=/home/pi/.config/streamlink/config`], {
        detached: true,
        uid: 1000,
        gid: 1000
    });
    stream.on(`close`, () => {
        message.channel.send("Stream zakończony.")
    })
    stream.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    stream.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
}

//PM2 List of proccesses
function ShowDashboard(message) {
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
    try {
        message.delete();
        if (args[0] > 99) {
            args[0] == 99;
        }
        let fetched;
        if (args[0] == -1) {

            do {
                fetched = await message.channel.fetchMessages({
                    limit: 100
                });
                fetched.forEach(async element => {
                    await element.delete();
                });
            }
            while (fetched.size >= 2);
            return;
        }

        fetched = await message.channel.fetchMessages({
            limit: args[0]
        });
        console.log(fetched.size + ' messages found, deleting...');
        message.channel.bulkDelete(fetched).catch(async error => {
            message.channel.send("Error: " + error + "\nTrying manual deletion.")
            fetched.forEach(async element => {
                await element.delete();
            });
        });
    } catch {
        message.channel.send("Przykro mi, ale nie mogę tego dla Ciebie zrobić. " + client.emojis.random());
        return;
    }
}

function Shout(message, args) {
    let shout = "";
    shout = args.join(" ")
    let url = `http://${data.serverIP}:${data.serverPort}/api/message?shout=${shout}&pass=${data.serverPassword}`;
    console.log(shout);

    return getJSON(encodeURI(url)).catch(function () {
        message.channel.send(`Message "${decodeURI(encodeURI(shout))}" has been sent to the Server!`);
    });
}

function Download(message, args) {
    let dlLink = args[0];
    let name;
    let path;
    if (args[1] != undefined && args[1].includes("/")) {
        name = args[1].split("/").pop();
        path = args[1].split("/", 1);
        if (path.includes("..")) {
            return;
        }
        if (!fs.existsSync(`/media/pi/usb/filmy/${path}`)) {
            let mkdircmd = `mkdir -m777 /media/pi/usb/filmy/${path}`;
            execSync(mkdircmd);
        }
        path += "/";
    } else {
        name = args[1];
    }
    if (typeof dlLink !== 'undefined') {
        if (typeof name == 'undefined') {
            let command = `wget --no-check-certificate -q -c -P /media/pi/usb/filmy/ '${dlLink}'`
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
        } else if (typeof path !== 'undefined') {
            let command = `wget --no-check-certificate -q -c -O /media/pi/usb/filmy/${path}${name} '${dlLink}'`
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
                    message.channel.send(`Download ${name} from link ${dlLink} was interrupted. Code: ${code}`);
                }
            });
        } else {
            let command = `wget --no-check-certificate -q -c -O /media/pi/usb/filmy/${name} '${dlLink}'`
            console.log(command);
            let download = exec(command /*,{'maxBuffer':1000*1024}*/ );
            message.channel.send(`Started downloading ${name}`);
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
        }
    } else {
        message.channel.send("Wrong download link!\nUse !dl Link Name or !dl Link");
    }
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function RestartServer(message, args) {
    let minutes = args[0];
    if (minutes == null) {
        minutes = 10;
    }
    const millisecondsPerMinute = 60000;
    let restartDate = new Date().getTime() + (minutes * millisecondsPerMinute);

    function CheckTime() {

        // Get todays date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = restartDate - now;
        // Time calculations for minutes and seconds
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (minutes > 0) {
            Shout(message, [`Server restart in ${minutes} minutes!`]);
        } else if (seconds > 0) {
            Shout(message, [`Server restart in ${seconds} seconds!`]);
        }
        // If the count down is over, write some text 
        if (distance < 0) {

            Shout(message, [`Server restart NOW!`]);
            exec(commands.restartServer);
            clearInterval(restartInterval);
        }
    }
    CheckTime();
    let restartInterval = setInterval(CheckTime, millisecondsPerMinute / 2);



}

function ShowEmbed(message) {
    let wiggleEmbed = Embed.setTitle("Wiggle!").setImage('https://cdn.discordapp.com/emojis/447649395735789568.gif');
    message.channel.send(wiggleEmbed);
}

client.login(password);