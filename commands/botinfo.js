const { MessageEmbed } = require("discord.js");

module.exports.run = async(client, msg, args) => {
  
  let bot = msg.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
  if(!bot) return msg.channel.send("You must mention bot or provide a bot id");
  if(!bot.bot) return msg.channel.send("He's not a robot");

  let data = await client.db.get(bot.id);
  if(!data) return msg.channel.send("The bot is not registered");
  
  let owner = await client.users.fetch(data.ownerId);
  
  let a = new MessageEmbed()
  .setAuthor(bot.username + " Info", bot.displayAvatarURL({format:"png", size:2048}))
  .setColor("#7289DA")
  .setThumbnail(msg.guild.iconURL({dynamic:true, size:2048, format:"png"}))
  .addField("ID", bot.id)
  .addField("Username", bot.username)
  .addField("Tag (Discriminator)", "#"+bot.discriminator)
  .addField("Short Description", data.sdecs)
  .addField("Library", data.library)
  .addField("Prefix", data.prefix)
  .addField("Total Vote", data.vote)
  .addField("Owner", owner)
  .setTimestamp()
  return msg.channel.send(a)
}