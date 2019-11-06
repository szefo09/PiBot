module.exports = {
    name: 'get-deckssave',
    description: 'Kompresuje obecną listę talii z danego dnia i wysyła ją w wiadomości.',
    execute(message, args) {
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
    },
};