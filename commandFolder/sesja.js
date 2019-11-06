module.exports = {
    name: 'sesja',
    description: 'info kiedy nastepna sesja D&D',
    execute(message, args) {
        let msg;
        fs.readFile("nowaSesja.txt", "utf-8", (err, data) => {
            if (err) {
                message.channel.send("brak ustawionej nowej sesji.")
            }
            msg = data;
            if (msg != null) {
                message.channel.send(`Następna sesja: ${msg}`);
            }
        })
        return;
    },
};