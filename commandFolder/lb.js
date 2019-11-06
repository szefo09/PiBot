module.exports = {
    name: 'lb',
    args: true,
    description: 'przelicza funty na kilogramy',
    execute(message, args) {
        let pound = args[0];

        if (isNaN(pound)) {
            return;
        }
        let kilograms = roundToTwo(pound * 0.45359237);
        message.channel.send(`${pound}lb equals ${kilograms}kg ⚖️`);
        return;
    },
};