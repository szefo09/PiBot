module.exports = {
    name: 'get-temp',
    description: 'podaje obecną temperaturę raspPi',
    execute(message, args) {
        GetTemperatureOfThePi().then((temp) => {
            return message.channel.send(temp);
        });
    },
};