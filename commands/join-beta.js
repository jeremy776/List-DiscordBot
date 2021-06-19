module.exports.run = async(client, msg, args) => {
  
  let member = msg.member;
  let roles = member.roles.cache.map(x => x.id);
  if(roles.includes("850274430193631272")) return msg.channel.send("sorry, but you have been a beta user before");
  
  member.roles.add("850274430193631272");
  return msg.channel.send("You are now a beta user, there may be some bugs in this beta mode.");
}