exports.run = async(client, message, args) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('voce deve entrar em um canal de voz antes de usar este comando!');

    let queue = message.client.queue.get(message.guild.id)

    if(!args[0]) return message.channel.send({
        embed: {
            description: 'O volume atual esta definido para: ' + queue.volume
        }
    })

    if(args[0] > 10) return message.channel.send('Volume (1 - 10)')

    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    queue.volume = args[0]
    message.channel.send({
        embed: {
            description: 'O volume esta definido para ' + args[0]
        }
    })
}