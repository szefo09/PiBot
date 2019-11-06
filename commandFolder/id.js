module.exports = {
    name: 'id',
    description: 'podaje id osoby, która wywołała komendę.',
    execute(message, args) {
        message.channel.send(message.author.id);
        return;
    },
};