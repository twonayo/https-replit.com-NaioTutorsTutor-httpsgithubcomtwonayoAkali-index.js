const { MessageEmbed } = require('discord.js')

exports.run = async (client, message) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('Voce deve entrar em um canal de voz antes de usar este comando! Faremos Do Meu  Jeito');
    const queue = message.client.queue.get(message.guild.id)
    let status;
    if (!queue) status = 'Nao ha nada na fila!'
    else status = queue.songs.map(x => '• ' + x.title + ' -Adicionado Por ' + `<@${x.requester.id}>`).join('\n')
    if(!queue) np = status
    else np = queue.songs[0].title
    if(queue) thumbnail = queue.songs[0].thumbnail
    else thumbnail = message.guild.iconURL()
    let embed = new MessageEmbed()
    .setTitle('Fila De Musicas')
    .setThumbnail(thumbnail)
    .setColor('BLACK')
    .addField('Tocando Agora', np, true)
    .setDescription(status)
    message.channel.send(embed)
}