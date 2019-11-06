module.exports = {
    name: 'reee',
    description: 'Anty-rage.',
    execute(message, args) {
        message.channel.send("Relax " + client.emojis.random(2).toString());
        return;
    },
};