const { MessageEmbed } = require("discord.js");

module.exports.run = async(client, msg, args) => {
  
  if(!msg.member.hasPermission("BAN_MEMBERS")) return msg.channel.send("You can't do that");
  
  let bot = msg.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
  if(!bot) return msg.channel.send("Mention the bot you want to reject");
  if(!bot.bot) return msg.channel.send("It's not a bot");
  
  let data = await client.db.get(bot.id);
  if(!data) return msg.channel.send("Bot not registered");
  if(data.status == true) return msg.channel.send("You cannot reject bots that have been approved");
  let owner = await client.users.fetch(data.ownerId);
    let reason = args.slice(1).join(" ");
    if(!reason) return msg.channel.send("If the bot has a problem, please provide a reason so that the owner of the bot can fix it");
    let embed = new MessageEmbed()
    .setColor("#7289DA")
    .setAuthor("Bot Declined")
    .setThumbnail(bot.displayAvatarURL({format:"png", size:2048}))
    .addField("Bot", bot.tag+"("+bot+")")
    .addField("Moderator", msg.author)
    .addField("Reason", reason)
    .setTimestamp()
    client.channels.cache.get(client.modLogs).send(embed)
    client.channels.cache.get(client.logs).send(`Bot ${bot} by ${owner} was declined.`)
    owner.send(`Your bot ${bot} [\`${bot.tag}\`] was declined. Reason:\n${reason}`)
  
  await client.db.delete(bot.id);
}