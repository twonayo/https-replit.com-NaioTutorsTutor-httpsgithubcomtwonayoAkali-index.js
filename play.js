const ytdl = require('ytdl-core-discord');
var scrapeYt = require("scrape-yt");
const discord = require('discord.js')
const { google } = require("googleapis");

exports.run = async (client, message, args) => {

    if (!args[0]) return message.channel.send('Voce nao forneceu uma masica para tocar!')
    let channel = message.member.voice.channel;
    if (!channel) return message.channel.send('Voce precisa entrar em um canal de voz para tocar uma musica!')

    if (!channel.permissionsFor(message.client.user).has("CONNECT")) return message.channel.send('Nao tenho permissao para entrar no canal de voz')
    if (!channel.permissionsFor(message.client.user).has("SPEAK")) return message.channel.send('Nao tenho permissao para falar no canal de voz')


    const server = message.client.queue.get(message.guild.id);
    let video = await scrapeYt.search(args.join(' '))
    let result = video[0]

    const song = {
        id: result.id,
        title: result.title,
        duration: result.duration,
        thumbnail: result.thumbnail,
        upload: result.uploadDate,
        views: result.viewCount,
        requester: message.author,
        channel: result.channel.name,
        channelurl: result.channel.url
      };

    var date = new Date(0);
    date.setSeconds(song.duration);
    var timeString = date.toISOString().substr(11, 8);

      if (server) {
        server.songs.push(song);
        console.log(server.songs);
        let embed = new discord.MessageEmbed()
            .setTitle('Adicionado a fila!')
        .setColor('BLACK')
        .addField('Name', song.title, true)
        .setThumbnail(song.thumbnail)
            .addField('visualizacoes', song.views, true)
        .addField('Adicionado por', song.requester, true)
        .addField('Duracao', timeString, true)
        return message.channel.send(embed)
    }

    const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        songs: [],
        volume: 10,
        playing: true
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);


    const play = async song => {
        const queue = message.client.queue.get(message.guild.id);
        if (!song) {
            queue.voiceChannel.leave();
            message.client.queue.delete(message.guild.id);
            message.channel.send('Nao ha musicas na fila, estou saindo do canal de voz!')
            return;
        }

        const dispatcher = queue.connection.play(await ytdl(`https://youtube.com/watch?v=${song.id}`, {
            filter: format => ['251'],
            highWaterMark: 1 << 25
        }), {
            type: 'opus'
        })
            .on('finish', () => {
                queue.songs.shift();
                play(queue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(queue.volume / 5);
        let noiceEmbed = new discord.MessageEmbed()
        .setTitle('Comecou a Tocar')
        .setColor("BLACK")
        .setThumbnail(song.thumbnail)
        .addField('Name', song.title, true)
        .addField('Adicionado por', song.requester, true)
            .addField('visualizacoes', song.views, true)
        .addField('Duracao', timeString, true)
        queue.textChannel.send(noiceEmbed);
    };


    try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        play(queueConstruct.songs[0]);
    } catch (error) {
        console.error(`Nao consegui entrar no canal de voz`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`Nao consegui entrar no canal de voz: ${error}`);
    }
}