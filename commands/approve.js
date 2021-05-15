module.exports.run = async (client, msg, args) => {
  if (!msg.member.hasPermission("BAN_MEMBERS"))
    return msg.channel.send("You can't do that");

  let bot =
    msg.mentions.users.first() ||
    (await client.users.fetch(args[0]).catch(() => null));
  if (!bot)
    return msg.channel.send("You must mention the bots that will be accepted");
  if (!bot.bot) return msg.channel.send("Looks like it's a user not a bot");
  
  let data = await client.db.get(bot.id);
  if (!data) return msg.channel.send("This bot is not registered");
  if (data.status == true) {
    return msg.channel.send("This bot has been accepted");
  } else {
    let owner = await client.users.fetch(data.ownerId);
    client.db.set(`${bot.id}.status`, true);
    client.channels.cache.get(client.logs)
      .send(
        `${bot} by ${owner} was approved by ${msg.author}.\nhttps://list-discordb.glitch.me/bot/${data.id}`
      );
    
    let botny = client.guilds.cache.get("830055801116295210").members.cache.get(bot.id)
    botny.roles.add("830056750874230815");
    botny.roles.remove("830056514642771968");
    
    let ownerny = client.guilds.cache.get("819924361183756349").members.cache.get(owner.id);
    ownerny.roles.add("832623307702009876");
    owner.send(`Your bot ${bot} [\`${bot.tag}\`] has been approved :tada:`)
    //client.db.set(`${bot.id}.status`, true);
    //client.db.set(`${bot.id}.approvedTime`, Date.now());
    return msg.channel.send(`${bot} has been approved`)
  }
};
