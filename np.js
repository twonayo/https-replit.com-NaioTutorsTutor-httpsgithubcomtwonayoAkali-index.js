const { MessageEmbed } = require('discord.js')
exports.run = async(client, message) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('Voce deve entrar em um canal de voz antes de usar este comando!');
    let queue = message.client.queue.get(message.guild.id)
    if(!queue) return message.channel.send({
        embed:{
            title: 'Nao ha nada tocando agora!!'
        }
    })
    message.channel.send({
        embed:{
            title: 'Tocando Agora',
            description: queue.songs[0].title + ' Adicionado por: ' + '<@' + queue.songs[0].requester + '>',
            color: 'BLACK',
            thumbnail: queue.songs[0].thumbnail
        }
    })
}