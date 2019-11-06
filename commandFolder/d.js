module.exports = {
    name: 'd',
    args: true,
    description: 'rzuć kością. po spacji podaj kostkę i ilość np. !d 10 4',
    execute(message, args) {
        let dice = args[0];
        let amount = args[1];
        if (isNaN(dice)) {
            return;
        }
        if (dice <= 0) {
            return;
        }
        if (isNaN(amount)) {
            let result = Math.floor(Math.random() * dice) + 1;
            if (isNaN(result)) {
                return;
            }
            message.channel.send(`🎲 Result of ${message.author.username}'s D${dice}: ${result} 🎲`);
        } else {
            if (amount <= 0) {
                return;
            }
            let result = [];
            for (let i = 0; i < amount; i++) {
                result.push(Math.floor(Math.random() * dice) + 1);
                if (isNaN(result[i])) {
                    return;
                }
            }
            message.channel.send(`🎲 Result of ${message.author.username}'s ${amount} D${dice}s: ${result.join(", ")} 🎲`);
        }
        return;
    },
};