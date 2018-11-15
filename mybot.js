const Discord = require("discord.js");
const client = new Discord.Client();
const compressing = require('compressing').zip;
var getJSON = require('get-json');
var exec = require('child_process').exec;
var commands=require("./commands/commands.js");
let data = require("./data.js");
let password = data.psswd;
const prefix =data.token;
client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
    let admin=false;
    if(message.content.toLowerCase().includes("u stupid")||message.content.toLowerCase().includes("baka")){
        message.channel.send("<@"+message.author.id+">"+" No U!");
    }
    if (!message.content.startsWith(prefix)|| message.author.bot){
        return;
    }
    let authorID=(message.author.id==data.szefoID || message.author.id==data.soulstealerID);
    if(authorID){
        admin=true;
    }else{
        admin=false;
    }
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(command==='help'){
        message.channel.send("Available Commands:\n!id\n!ping\n!get-duellog\n!get-deckssave\n!dl linkToTheFile nameOfTheFile\n!restart-Server\n!update-Scripts\n!update-YgoPro\n!update-Windbot\n!restart-Pi\n!update-Bot");
    }
    if(command==='id'){
        message.channel.send(message.author.id);
        return;
    }
    if (command==='ping') 
    {
        message.channel.send("pong!");
        return;
    }
    if(command==='dl' && admin){
        let dlLink=args[0];
        let name =args[1];
        
        if(typeof dlLink!=='undefined'){
            
            if(typeof name !== 'undefined'){
                let command =`wget -q -c -O /media/pi/usb/filmy/${name} '${dlLink}'`
                message.channel.send(`Started downloading ${name}`);
                console.log(command)
                let download = exec(command/*,{'maxBuffer':1000*1024}*/);
                 download.on('error',(error)=>{
                     message.channel.send(`Error downloading ${name} from ${dlLink}.\n${error}`);
                     return;
                 });
                 download.on('close', function(code,signal) {
                     if(code===0){
                        message.channel.send(`Download ${name} from link ${dlLink} Completed.`);
                     }else{
                        message.channel.send(`Download ${name} from link ${dlLink} was interrupted.`);
                     }
                 });
            }else{
                let command = `wget -q -c -P /media/pi/usb/filmy/ '${dlLink}'`
                console.log(command);
                let download = exec(command/*,{'maxBuffer':1000*1024}*/);
                message.channel.send(`Started downloading ${dlLink}`);
                 download.on('error',(error)=>{
                     message.channel.send(`Error downloading from ${dlLink}.\n${error}`);
                     return;
                 });
                 download.on('close', function(code,signal) {
                     if(code===0){
                        message.channel.send(`Download from link ${dlLink} Completed.`);
                     }else{
                        message.channel.send(`Download from link ${dlLink} was interrupted.`);
                     }
                 });
            }
        }else{
            message.channel.send("Wrong download link!\nUse !dl Link Name or !dl Link");
        }
    }
    if(command==='restart-server' && admin){
        message.channel.send("restarting the server!");
        console.log(commands.restartServer);
        exec(commands.restartServer);
    }
    if(command==='update-scripts' && admin){
        message.channel.send("Updating Server Scripts and databases!");
        console.log(commands.updateScript);
        exec(commands.updateScript);
    }
    if(command==="update-ygopro" && admin){
        message.channel.send("Updating YgoPro!");
        console.log(commands.updateYgoPro);
        exec(commands.updateYgoPro);
    }
    if(command==="update-windbot" && admin){
        message.channel.send("Updating Windbot!");
        console.log(commands.updateWindbot);
        exec(commands.updateWindbot);
    }
    if(command==="restart-pi" && admin){
        message.channel.send("Restarting Pi!");
        exec(commands.restartPi);
    }
    if(command==="update-bot" && admin){
        message.channel.send("BeepBoop Updating myself!")
        exec(commands.updateBot);
    }
    if(command==="get-duellog"){
      compressing.compressFile('/home/pi/server/ygopro-server/config/duel_log.json','/media/pi/usb/duel_log.zip')
      .then(()=>{
          message.channel.send("Your duel-log.zip: ",{files:["/media/pi/usb/duel_log.zip"]})
      })
      .catch((reason)=>{message.channel.send("Something went wrong preparing duel_log.zip\n"+reason)}); 
    }
    if(command==="get-deckssave"){
        compressing.compressDir('/home/pi/server/ygopro-server/decks_save','/media/pi/usb/decks_save.zip')
        .then(()=>{
            message.channel.send("Your decks_save.zip: ",{files:["/media/pi/usb/decks_save.zip"]})
        })
        .catch(); 
    }
    if(command==="getrooms" && admin){
        let response = loadRooms();
        //message.channel.send(response.toString());
    }
});
function loadRooms(){
    //http://192.168.1.17:7211/api/getrooms?callback=?&pass=Nanahira

    let url=`http://${data.serverIP}:${data.serverPort}/api/getrooms?callback=?&pass=${data.serverPassword}`;
    console.log(url);
    getJSON(url).then(function(response) {
         console.log(response);
    }).catch(function(error) {
        console.log(error);
     });
}
client.login(password);