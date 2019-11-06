module.exports = {
    name: 'ft',
    args: true,
    description: 'przelicza ft i inch na metry. Podaj stopy, a po spacji inche.',
    execute(message, args) {
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
    },
};