module.exports = {
    name: 'get-duellog',
    description: 'kompresuje obecny duellog i wysyła go w wiadomości.',
    execute(message, args) {
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
    },
};