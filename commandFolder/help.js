const prefix = require("./data.js").token;

module.exports = {
    name: 'help',
    description: 'Lista wszystkich dostępnych komend.',
    execute(message, args) {
        const data = [];
        const {
            commands
        } = message.client;
            data.push(`Here\'s a list of all my commands:`);
            data.push(commands.map(command => `${command.name} - ${command.description}`).join(', '));
            return message.channel.send(data, {split: true});
    },
};