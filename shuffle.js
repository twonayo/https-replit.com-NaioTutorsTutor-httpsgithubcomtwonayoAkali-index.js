exports.run = async(client, message, args) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('Voce deve entrar em um canal de voz antes de usar este comando!');
    const queue = message.client.queue.get(message.guild.id)
    if (!queue) return message.channel.send('Nao ha musicas na fila para embaralhar Aleatoriamente')
    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    message.channel.send(`Ordem aleatória da fila atual 🔀`).catch(console.error);
}
