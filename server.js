const Discord = require("discord.js");
const client = new Discord.Client({ fetchAllMembers: true });
const bodyParser = require("body-parser");
const http = require("http");
const prefix = "-";
const fs = require("fs");
const dbs = require("quick.db");

const { Database } = require("quickmongo");
let urlData = process.env.MONGOURL;
const db = new Database(
  "mongodb+srv://jeremy:jeremykusuma@cluster0.d0mjj.mongodb.net/listbot?retryWrites=true&w=majority"
);

let category = require("./category-list.json");
let lib = require("./library");
client.commands = new Discord.Collection();
client.db = db;
client.qdb = require("quick.db");
client.logs = "820581016330567690";
client.modLogs = "821336010105290762";

client.on("message", async message => {
  let msg = message.content.toLowerCase();
  let args = message.content
    .slice(prefix.length)
    .trim()
    .split(" ");
  let cmd = args.shift().toLowerCase();
  let sender = message.author;

  if (!msg.startsWith(prefix)) return;
  if (sender.bot) return;

  try {
    let commandFile = require(`./commands/${cmd}.js`);

    const co = fs
      .readdirSync("./commands")
      .filter(file => file.endsWith(".js"));
    co.forEach(file => {
      const command = require(`./commands/${file}`);
      client.commands.set(file, command);

      console.log(file);
    });

    commandFile.run(client, message, args);
  } catch (e) {
    console.log(e.message);
  } finally {
   
  }
});

client.on("guildMemberAdd", member => {
  
  if(member.guild.id == "830055801116295210") {
    if(member.user.bot) {
      let role = member.guild.roles.cache.get("830056514642771968");
      member.roles.add(role);
    }
  }
  
  if(member.guild.id == "819924361183756349") {
    if(member.user.bot) {
      let role = member.guild.roles.cache.get("829533111515611216");
      member.roles.add(role);
    }
  }
  
});

client.on("guildMemberRemove", async(member) => {
  
  if(member.guild.id == "819924361183756349") {
    
    if(member.user.bot) {
      let data = await client.db.get(member.user.id)
      if(!data) return;
      let bot = client.users.cache.get(data.id);
      let modlog = client.channels.cache.get("821336010105290762");
      
      let embed = new Discord.MessageEmbed()
      .setDescription(`**\`${bot.tag}\` was deleted`)
      .setColor("RED");
      modlog.send(embed);
      
      await client.db.delete(member.user.id);
    }
    
    if(!member.user.bot) {
      
      let allData = await client.db.all();
      let modlog = client.channels.cache.get("821336010105290762");
      
      let getBotOwner = allData.map(x => x.data).filter(x => x.ownerId == member.user.id)
      if(getBotOwner.length == 0) return;
      
      for(let i = 0; i < getBotOwner.length; i++) {
        let bot = client.users.cache.get(getBotOwner[i].id);
        
        member.guild.members.cache.get(getBotOwner[i].id)
        .kick("Owner left server")
        .then(() => {
          console.log("Leave");
        })
        .catch(err => {
          console.log(err);
        });
        
        let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(`**\`${bot.tag}\` was deleted. \`${member.user.tag}\` left server**`)
        modlog.send(embed)
        
        await client.db.delete(getBotOwner[i].id);
      }
      
    }
  }
  
});

client.on("ready", async() => {
  let bot = await client.db.all();
  client.user.setActivity(`${bot.length} bot's`, { type: "WATCHING" });

  console.log("BOT SUDAH AKTIF");
});

/* WEBSITE */
var express = require("express"),
  session = require("express-session"),
  passport = require("passport"),
  Strategy = require("passport-discord").Strategy,
  app = express();
const moment = require("moment");
const ms = require("parse-ms");
const markdown = require("markdown").markdown;
const request = require("request");
const flash = require("connect-flash");

const cookieParser = require("cookie-parser");
const csrf = require("csurf");
var Protection = csrf({ cookie: true })
// uptime
const axios = require("axios");
const urls = ["https://list-discordb.glitch.me/"];

const uptimerobo = async () => {
  setInterval(() => {
    urls.forEach(url => {
      axios
        .get(url)
        .then(() => console.log("Ping at " + Date.now()))
        .catch(() => {});
    });
  }, 60 * 1000);
};

uptimerobo();

var url = bodyParser.urlencoded({ extended: false });

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var scopes = ["identify", "guilds", "guilds.join"];
var prompt = "consent";

passport.use(
  new Strategy(
    {
      clientID: process.env.ID,
      clientSecret: process.env.SECRET,
      callbackURL: process.env.URL,
      scope: scopes,
      prompt: prompt
    },
    function(accessToken, refreshToken, profile, cb) {
      process.nextTick(function() {
        return cb(null, profile);
      });
    }
  )
);

app.use(
  session({
    secret: "bangsawan",
    resave: true,
    saveUninitialized: true
  })
);
app.use(cookieParser())
app.use(flash())
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(passport.initialize());
app.use(function(req, res, next) {
  res.locals.message = req.flash("message");
  next();
});
app.use(passport.session());
app.get(
  "/login",
  passport.authenticate("discord", { scope: scopes, prompt: prompt }),
  function(req, res) {}
);
app.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  async function(req, res) {
    if (req.session.backURL) {
      res.redirect(req.session.backURL);
      req.session.backURL = null;
    } else {
      res.redirect("/");
    }

    const axios = require("axios")
  await axios.put(`https://discord.com/api/v8/guilds/819924361183756349/members/${req.user.id}`, {
    access_token: req.user.accessToken
  },{
    headers:{
      Authorization:`Bot ${process.env.TOKEN}`}
  }).catch(err => console.log(err))
    
  }
);
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/", async (req, res) => {
  console.log("Request");
  req.session.backURL = req.url
  if(req.user) {
    if(imBeta(req.user.id)) {
      res.render("beta/newHome.ejs", {
        user:req.user,
        client:client,
        category:category,
        allData:await client.db.all(),
        moment:moment,
        res:res,
        req:req
      });
    }
  }
  
  res.render("home.ejs", {
    user: req.user,
    client: client,
    category: category,
    allData: await client.db.all(),
    req: req,
    moment: moment,
    res: res
  });
});

app.get("/tag/:category", async function(req, res) {
  if (
    !category.map(x => x.name.toLowerCase()).includes(req.params.category)
  ) {
    return res.redirect("/");
  }
  req.session.backURL = req.url
  res.render("category.ejs", {
    user: req.user,
    client: client,
    req: req,
    category:category,
    allData: await client.db.all(),
    res: res
  });
});

app.get("/search/:name", async function(req, res) {
  if (!req.params.name) {
    return res.redirect("/");
  }
  req.session.backURL = req.url;
  res.render("cari.ejs", {
    user: req.user,
    client: client,
    allData: await client.db.all(),
    category:category,
    req: req,
    res: res
  });
});

app.get("/edit/:id", checkAuth, Protection, async function(req, res) {
  let database = await client.db.get(req.params.id);
  if(!database) return res.render("404.ejs", {client:client});
  
  if(req.user.id !== database.ownerId) return res.render("404.ejs", {client:client});
  req.session.backURL = req.url;
  res.render("edit.ejs", {
    user: req.user,
    category:category,
    lib:lib,
    client: client,
    csrfToken: req.csrfToken(),
    data:await client.db.get(req.params.id),
    req: req,
    res: res
  });
});

app.get("/vote/:id", checkAuth, Protection, async function(req, res) {
  
  let status = await client.db.get(req.params.id);
  if(status.status === false) {
    return res.render("404.ejs", {client:client});
  }
  req.session.backURL = req.url;
  res.render("vote.ejs", {
    user: req.user,
    client: client,
    csrfToken: req.csrfToken(),
    db: await client.db.get(req.params.id),
    req: req,
    res: res
  });
});

app.get("/discord", function(req, res) {
  res.redirect("https://discord.gg/k7wPzvN4RN");
});

app.get("/add", url, Protection, checkAuth, function(req, res) {
  
  req.session.backURL = req.url;
    if(imBeta(req.user.id)) {
      return res.render("beta/newAdd.ejs", {
        user:req.user,
        client:client,
        lib:lib,
        csrfToken:req.csrfToken(),
        category:category,
        req:req
      });
    }
  
  
  res.render("add.ejs", {
    user: req.user,
    client: client,
    lib: lib,
    csrfToken: req.csrfToken(),
    category: category,
    req: req
  });
});

const mds = require("marked");
const hljs = require("highlight.js");

var md = require("markdown-it")({
  html: true,
  xhtmlOut: true,
  breaks: true,
  langPrefix: "language-",
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          "</code></pre>"
        );
      } catch (__) {}
    }

    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  }
});

app.get("/bot/:id", Protection, async function(req, res) {
  
  if(!req.params.id) {
    res.render("404.ejs", { client:client })
  }
  let data = await client.db.get(req.params.id);
  if(!data) {
    res.render("404.ejs", {client:client})
  }
  req.session.backURL = req.url;
  mds.setOptions({
    renderer: new mds.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });
  
  if(req.user) {
    if(imBeta(req.user.id)) {
      res.render("beta/newBot.ejs", {
        res:res,
        req:req,
        user:req.user || null,
        client:client,
        csrfToken: req.csrfToken(),
        data:data,
        userComment:await axios.get(`https://list-discordb.glitch.me/api/key/Jeremy/comment/${req.params.id}`),
        description:mds(data.description),
        markdown:markdown
    });
    }
  }
  
  res.render("bot.ejs", {
    res: res,
    req: req,
    user: req.user || null,
    client: client,
    csrfToken: req.csrfToken(),
    data: data,
    userComment:await axios.get(`https://list-discordb.glitch.me/api/key/Jeremy/comment/${req.params.id}`),
    descriptionn: mds(data.description),
    description: md.render(data.description),
    markdown: markdown
  });
  
});

app.get("/me", checkAuth, async function(req, res) {
  req.session.backURL = req.url;
  res.render("me.ejs", {
    res: res,
    req: req,
    user: req.user,
    user1: await client.users.fetch(req.user.id),
    client: client,
    db: db
  });
});

app.get("/user/:id", async function(req, res) {
  
  let userNya = await client.users.fetch(req.params.id);
  /*if(!userNya) {
    return res.render("404.ejs", {client:client});
  }*/
  
  if(userNya.bot) {
    return res.render("404.ejs", {client:client});
  }
  
  req.session.backURL = req.url;
  
  res.render("user.ejs", {
    res: res,
    req: req,
    user: (await client.users.fetch(req.params.id)) || null,
    client: client,
    allData: await client.db.all()
  });
});

// POST METHOD

app.post("/bio/edit/:id", url, async function(req, res) {
  db.set(`bio_${req.user.id}`, req.body.bio);

  res.redirect("/me");
});

app.post("/vote/:id", url, Protection, async function(req, res) {
  let author = dbs.fetch(`voting.${req.user.id}.${req.params.id}`);
  let timeout = 86400000;

  let data = await client.db.get(req.params.id);
  let approved = data.status;
  if (approved === false) {
    res.redirect("/");
  }

  if (author !== null && timeout - (Date.now() - author) > 0) {
    let time = ms(timeout - (Date.now() - author));
    
    req.flash("message", "You have voted today. Try again later");
    res.redirect(`/vote/${req.params.id}`);
  } else {
    client.channels.cache
      .get("831480768394952724")
      .send(
        `**${req.user.username}#${req.user.discriminator}** has vote **${
          client.users.cache.get(req.params.id).tag
        }**`
      );
    
    let voteNow = await client.db.get(`${req.params.id}.vote`);
    let testing = voteNow + 1;
    await client.db.set(`${req.params.id}.vote`, testing);
    dbs.set(`voting.${req.user.id}.${req.params.id}`, Date.now());

    res.redirect(`/bot/${req.params.id}`);
  }
});

app.post("/new", url, Protection, async function(req, res) {
  let invite = req.body.invite;
  let invites = `https://discordapp.com/oauth2/authorize?client_id=${req.body.id}&scope=bot&permissions=0`;
  if (!invite) invite = invites;
  
  let tag = req.body.tags;
  if(!tag) {
    req.flash("message", "You don't select a category");
    return res.redirect("/add");
  }
  console.log(tag.length);
  if(tag.includes(", ")) {
    if(tag.join(" ").split(" ").length > 4) {
      req.flash("message", "The category you choose exceeds the maximum limit");
      return res.redirect("/add");
    }
  }
  
  let bot = await client.users.fetch(req.body.id);
  if (!bot) {
    req.flash("message", "This bot was not found");
    return res.redirect("/add");
  }

  if (!bot.bot) {
    req.flash("message", "It looks like what you are entering is not a bot, but a user");
    return res.redirect("/add");
  }

  let data = await client.db.get(`${req.body.id}`);
  if (!data) {
    let embed = new Discord.MessageEmbed()
      .setAuthor(
        `New bot`,
        client.users.cache.get(req.user.id).displayAvatarURL()
      )
      .setDescription(`Thanks for add your bot **${bot.tag}**`)
      .setThumbnail(client.users.cache.get(req.body.id).displayAvatarURL())
      .addField(`Owner:`, req.user.username + "#" + req.user.discriminator)
      .addField(`Bot name:`, `${bot.tag}`)
      .addField(`Bot prefix:`, `${req.body.prefix}`)
      .addField(`Category`, tag)
      .addField("Invite", `[Click Here](${invite})`)
      /*.addField(`Library`, req.body.library)*/
      .setFooter(`Add to queue`)
      .setColor("GREEN");

    res.redirect("/");
    client.channels.cache.get("820581016330567690").send(embed);
    let website = req.body.website;
    if(!website) website = null;

    let user = {
      id: req.body.id,
      ownerId: req.user.id,
      prefix: req.body.prefix,
      description: req.body.description,
      sdecs: req.body.shortDesc,
      invite: invite,
      owners: null,
      github: null,
      supportServer: req.body.supportServer,
      category: req.body.tags,
      website: website,
      library: req.body.library,
      vote: 0,
      servers: 0,
      comment: [
        
      ],
      promoted: false,
      status: false
    };

    return client.db.set(req.body.id, user);
  }else{
    req.flash("message", "This bot is already registered");
    return res.redirect("/add");
  }
});

app.post("/replyTo/:id/:botId", url, Protection, async function(req, res) {
  let data = await client.db.get(req.params.botId);
  if(!data) {
    return res.redirect("/bot/"+req.params.botId);
  }
});

app.post("/deleteComment/:id", url, Protection, async function(req, res) {
  let data = await client.db.get(req.params.id);
  if(!data) {
    return res.redirect("/bot/"+req.params.id);
  }
  if(!data.comment.map(x => x.id).includes(req.user.id)) {
    return res.redirect("/bot/"+req.params.id);
  }else{
    let arr = await client.db.get(`${req.params.id}.comment`)
    let filtered = arr.filter(x => x.id !== req.user.id)
    await client.db.set(`${req.params.id}.comment`, filtered)
    return res.redirect("/bot/"+req.params.id);
  }
});

app.post("/bot/:id", url, Protection, async function(req, res) {
  let data = await client.db.get(req.params.id);
  if(!data) {
    return res.redirect("/bot/"+req.params.id)
  }
  
  if(!data.comment.map(x => x.id).includes(req.user.id)) {
  
  let message = req.body.message;
  if(!message) return res.redirect("/bot/"+req.params.id);
  let rating = req.body.rate;
    if(!rating) return res.redirect("/bot/"+req.params.id);
  //if(!["1", "2", "3", "4", "5"].includes(rating)) return res.redirect("/bot/"+req.params.id)
  console.log(rating +" Rating");
  await client.db.push(`${req.params.id}.comment`, {
    id: req.user.id,
    message: message,
    rate:rating,
    reply:[],
    timestamp: Date.now()
  });
  //await client.db.add(`${req.params.id}.rating.${rating - 1}.count`, 1)
  return res.redirect("/bot/"+req.params.id);
  }else{
    req.flash("message", "You only have 1 chance to comment on this bot");
    return res.redirect("/bot/"+req.params.id);
  }
});

app.post("/edit/:id", url, Protection, async function(req, res) {
  let data = await client.db.get(req.params.id);
  if(!data) {
    res.render("404.ejs", { client:client });
  }
  if(req.user.id !== data.ownerId) {
    res.render("404.ejs", { client:client });
  }
  
  if(data.bgURL == undefined) {
    let url = req.body.bgURL;
    if(!url) url = null;
    data.bgURL = url;
    await client.db.set(`${req.params.id}`, data)
  }
  
  let prefix = req.body.prefix;
  if(!prefix) prefix = data.prefix;
  let description = req.body.description;
  if(!description) description = data.description;
  let sdecs = req.body.shortDesc;
  if(!sdecs) sdecs = data.sdecs;
  let invite = req.body.invite;
  if(!invite) invite = data.invite;
  let supportServer = req.body.supportServer;
  if(!supportServer) supportServer = data.supportServer;
  let category = req.body.tags;
  if(!category) category = data.category;
  let library = req.body.library;
  if(!library) library = data.library;
  let website = req.body.website;
  if(!website) website = data.website;
  let bgUrl = req.body.bgURL;
  if(!bgUrl) bgUrl = data.bgURL;
  
  await client.db.set(`${req.params.id}.bgURL`, bgUrl)
  await client.db.set(`${req.params.id}.website`, website);
  await client.db.set(`${req.params.id}.prefix`, prefix);
  await client.db.set(`${req.params.id}.description`, description);
  await client.db.set(`${req.params.id}.sdecs`, sdecs);
  await client.db.set(`${req.params.id}.invite`, invite);
  await client.db.set(`${req.params.id}.supportServer`, supportServer);
  await client.db.set(`${req.params.id}.category`, category);
  await client.db.set(`${req.params.id}.library`, library);

  let bot = await client.users.fetch(data.id);
  let owner = await client.users.fetch(data.ownerId);
  res.redirect(`/bot/${data.id}`);
  return client.channels.cache.get(client.logs).send(`${owner} edited ${bot}.\nhttps://list-discordb.glitch.me/bot/${data.id}`);
});

// API WEBSITE
app.get("/api/:key/:id", async function(req, res) {
  if(req.params.key !== "jeremy") return res.send({message:"invalid ket"});
  
  let dataBot = await client.db.get(req.params.id);
  if(!dataBot) return res.status(404).end(JSON.stringify({message: "No bot data found", status: 404}, null, 3));
  
  let bot = await client.users.fetch(dataBot.id);
  let data = {
    id:req.params.id,
    name: bot.username,
    discriminator: bot.discriminator,
    prefix: dataBot.prefix,
    shortDescription: dataBot.sdecs,
    vote: dataBot.vote,
    library: dataBot.library,
    approved: dataBot.status,
    ownerId: dataBot.ownerId,
    
  }
  res.end(JSON.stringify(data, null, 3));
});

app.get("/api/key/Jeremy/comment/:id", async function(req, res) {
  
  let data = await client.db.get(req.params.id);
  if(!data) return res.status(404).send({message: "Data not found", status:404});
  
  let ayam = {};
  
  if(data.comment) {
    await Promise.all(data.comment.map(async (x) => {
      let datnya = await client.users.fetch(x.id);
      ayam[x.id] = {
        "Username": datnya.username,
        "Avatar": datnya.displayAvatarURL({size:2048, format: "png"})
      }
    }));
  };
  
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(ayam, null, 3));
  
});

app.use(express.json());

app.get("/arc-sw.js", function(req, res) {
  res.setHeader("Content-Type", "application/javascript");
  res.status(200).send(`!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=100)}({100:function(e,t,r){"use strict";r.r(t);var n=r(3);if("undefined"!=typeof ServiceWorkerGlobalScope){var o="https://arc.io"+n.k;importScripts(o)}else if("undefined"!=typeof SharedWorkerGlobalScope){var c="https://arc.io"+n.i;importScripts(c)}else if("undefined"!=typeof DedicatedWorkerGlobalScope){var i="https://arc.io"+n.b;importScripts(i)}},3:function(e,t,r){"use strict";r.d(t,"a",function(){return n}),r.d(t,"f",function(){return c}),r.d(t,"j",function(){return i}),r.d(t,"i",function(){return a}),r.d(t,"b",function(){return d}),r.d(t,"k",function(){return f}),r.d(t,"c",function(){return p}),r.d(t,"d",function(){return s}),r.d(t,"e",function(){return l}),r.d(t,"g",function(){return m}),r.d(t,"h",function(){return v});var n={images:["bmp","jpeg","jpg","ttf","pict","svg","webp","eps","svgz","gif","png","ico","tif","tiff","bpg"],video:["mp4","3gp","webm","mkv","flv","f4v","f4p","f4bogv","drc","avi","mov","qt","wmv","amv","mpg","mp2","mpeg","mpe","m2v","m4v","3g2","gifv","mpv"],audio:["mid","midi","aac","aiff","flac","m4a","m4p","mp3","ogg","oga","mogg","opus","ra","rm","wav","webm","f4a","pat"],documents:["pdf","ps","doc","docx","ppt","pptx","xls","otf","xlsx"],other:["swf"]},o="arc:",c={COMLINK_INIT:"".concat(o,"comlink:init"),NODE_ID:"".concat(o,":nodeId"),CDN_CONFIG:"".concat(o,"cdn:config"),P2P_CLIENT_READY:"".concat(o,"cdn:ready"),STORED_FIDS:"".concat(o,"cdn:storedFids"),SW_HEALTH_CHECK:"".concat(o,"cdn:healthCheck"),WIDGET_CONFIG:"".concat(o,"widget:config"),WIDGET_INIT:"".concat(o,"widget:init"),WIDGET_UI_LOAD:"".concat(o,"widget:load"),BROKER_LOAD:"".concat(o,"broker:load"),RENDER_FILE:"".concat(o,"inlay:renderFile"),FILE_RENDERED:"".concat(o,"inlay:fileRendered")},i="serviceWorker",a="/".concat("shared-worker",".js"),d="/".concat("dedicated-worker",".js"),f="/".concat("arc-sw-core",".js"),u="".concat("arc-sw",".js"),p=("/".concat(u),"/".concat("arc-sw"),"arc-db"),s="key-val-store",l=2**17,m="".concat("https://overmind.arc.io","/api/propertySession"),v="".concat("https://warden.arc.io","/mailbox/propertySession")}});`)
});

app.get("*", function(req, res) {
  res.status(404).render("404.ejs", {
    client:client
  });
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.session.backURL = req.url;
  res.redirect("/login");
}

function imBeta(id) {
  return client.guilds.cache.get("819924361183756349").roles.cache.get("850274430193631272").members.map(x => x.id).includes(id);
}

app.listen(process.env.PORT, function(err) {
  if (err) return console.log(err);
  console.log("Listening at web");
});

client.login(process.env.TOKEN);