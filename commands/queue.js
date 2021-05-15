module.exports.run = async(client, msg, args) => {
  
  let { MessageEmbed } = require("discord.js");
  
  let embed = new MessageEmbed()
  .setColor("#7289DA")
  .setTimestamp()
  
  let allBot = await client.db.all();
  
  let notRegis = allBot.map(x => x.data).filter(x => x.status !== true);
  if(notRegis.length < 1) return msg.channel.send("No bots in queue");
  
  for(let i = 0; i < notRegis.length; i++) {
    embed.setAuthor(notRegis.length + " Bot's")
    let bot = await client.users.fetch(notRegis[i].id);
    embed.addField(bot.username + "#"+bot.discriminator, `[Invite Here](https://discordapp.com/oauth2/authorize?client_id=${notRegis[i].id}&scope=bot&permissions=0)`)
  }
  
  return msg.channel.send(embed);
  
};