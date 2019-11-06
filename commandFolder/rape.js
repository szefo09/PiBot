module.exports = {
    name: 'rape',
    description: 'nie wywołuj tej komendy.',
    execute(message, args) {
        message.channel.send("N-No... Don't! Yamete Kudasai Senpai!!");
        return;
    },
};