const inspect = require('util').inspect
const fs = require("fs")
const Discord = require('discord.js');
//const c = require("../../config.json")
const clean = input => {
    const output = typeof input === 'string' ? input : inspect(input);
    return output.replace(/(@|`)/g, '$1\u200b');
};

module.exports.run = async (client, msg, query) => {
  
  if(!["580640622235484161", "574783649296416771", "593774699654283265", "722363639176101949"].includes(msg.author.id)) return;
  
  const { args, flags } = parseQuery(query)
  
  let warningTokenMessage = ['T0l0l']
     const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor("EVALED COMMANDS")
    .setFooter(`${msg.author.username} RUN EVALED`)
    .setTimestamp()
    .setThumbnail(msg.guild.iconURL())
    .addField('📥 | Input', '```js\n' + args.join(" ") + '```')

    try {
        let code = args.join(' ');
        // Evaled Time
        let evaled;
        if (code.includes(`client.token`)) {
          evaled = warningTokenMessage[Math.floor(Math.random() * warningTokenMessage.length)];
          console.log(`${msg.author.tag} use this eval to against the tokens and privacy.`)
        } else {
          if(flags.includes("async")) {
            code = `(async() => { ${code} })()`;
          }
          evaled = await eval(code);
          /*let type = evaled && evaled.constructor ? evaled.constructor.name : typeof evaled;
          if (evaled instanceof Promise) {
            evaled = await eval(code);
          } else {
            evaled = eval(code);
          }*/
          }
        
        if (typeof evaled !== 'string')
            evaled = require('util').inspect(evaled, { depth: 0 });
      let output = clean(evaled);
      if (output.length > 1024) {
          //const { body } = await post('https://hasteb.in/documents').send(output);
         // embed.addField('📤 | Output', `https://hasteb.in/${body.key}.js`);
      } else {
          embed.addField('📤 | Output', '```js\n' + output + '```');
      }
      msg.channel.send(embed);
    } catch (e) {
      let error = clean(e);
      if (error.length > 2048) {
          //const { body } = await post('https://hasteb.in/documents').send(error);
          //embed.addField('❌ | Error', `https://hasteb.in/${body.key}.js`);
      } else {
          embed.addField('❌ | Error', '```js\n' + error + '```');
      }
      msg.channel.send(embed);
    }
  
  function parseQuery(queries) {
  const args = [];
  const flags = [];
  for (const query of queries) {
    if (query.startsWith("--")) flags.push(query.slice(2).toLowerCase());
    else args.push(query);
  }
  return { args, flags };
}
  
}