const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

exports.run = async(client, message, args) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Nao ha nada Tocando.").catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
        if (!lyrics) lyrics = `Nenhuma letra encontrada para ${queue.songs[0].title} :(`;
    } catch (error) {
        lyrics = `Nenhuma letra encontrada para ${queue.songs[0].title} :(`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle(`Lyrics Para ${queue.songs[0].title}`)
      .setDescription(lyrics)
      .setColor("BLACK")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
}
