const Discord = require('discord.js');
const bot = new Discord.Client();
const token = process.env.DISCORD_BOT_SECRET;
const Prefix = 'f!';
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 0.5 };
const queue = new Map();
const keep_alive = require('./keep_alive.js');
const hangman = require('discord-hangman');

bot.on('ready', () => {
  console.log('This bot is online!');
  bot.user
    .setActivity("f!help", { type: 'WATCHING' })
    .catch(console.error);
});

function checkDays(date) {
  let now = new Date();
  let diff = now.getTime() - date.getTime();
  let days = Math.floor(diff / 86400000);
  return days + (days == 1 ? ' day' : ' days') + ' ago';
}

bot.on('message', message => {
  if (!message.content.startsWith(Prefix)) return;
  let args = message.content.substring(Prefix.length).split(' ');
  const ownerSent = message.author.id === '527957384912437249';
  const serverQueue = queue.get(message.guild.id);

  switch (args[0]) {
    case 'status':
      const status = new Discord.RichEmbed()
        .addField('Status: ', 'Online')
        .addField('Version: ', '2.0.0 [Now with working music!]')
        .setColor(0x000000)

        .setFooter('My Prefix is "k!"');
      message.channel.send(status);
      break;

    case 'r34':
      if (!args[1]) return message.reply('Please enter a tag.');
      message.channel.send('https://rule34.xxx/index.php?page=post&s=list&tags=' + args[1]);
      break;

    case 'chris':
      const prank = new Discord.RichEmbed()
        .setImage(
          'https://cdn.discordapp.com/attachments/569646445096075265/622008667088355328/image0.jpg'
        )
        .setColor(0x71eeb8);
      message.channel.send(prank);
    break;

    case 'hangman':
      hangman.create(message.channel, 'random', { players: [message.author] }).then(data => {

      if(!data.game) return; // If the game is cancelled or no one joins it

      if (data.game.status === 'won') {
        if (data.selector) message.channel.send(`Congratulations, you found the word! ${data.selector.username}... You should provide a more complicated word next time!`); // data.selector is the user who chose the word (only in custom game mode)

        else message.channel.send('Congratulations you found the word!');
      }
      else if (data.game.status === 'lost') {
        if (data.selector) message.channel.send(`${data.selector.username} Beat you all! The word was ${data.game.word}.`);
        
        else message.channel.send(`You lost! The word was ${data.game.word}.`);
      }
      else {
        message.channel.send('15 minutes have passed! The game is over.'); // If no one answers for 15 minutes
      }

      });
    break;

    case 'guzzle':
      const guzzle = new Discord.RichEmbed()
        .setImage(
          'https://cdn.discordapp.com/attachments/688201395303612439/936417234560110602/FinalGif-16394834806.gif'
        )
        .setColor(0x71eeb8);
      message.channel.send(guzzle);
      break;

    case 'disappointment':
      const sadge = new Discord.RichEmbed()
        .setImage(
          'https://media.discordapp.net/attachments/803574284378570795/868126289687642132/Screenshot_20210723-144135_Messages.jpg?width=243&height=300'
        )
        .setColor(0x71eeb8);
      message.channel.send(sadge);
      break;

    case 'connect':
      const voicechannel = message.member.voiceChannel;
      if (!voicechannel) return console.error("The channel does not exist!");
      voicechannel.join().then(connection => {
        // Yay, it worked!
        console.log("Successfully connected.");
      }).catch(e => {
        // Oh no, it errored! Let's log it to console :)
        console.error(e);
      });
    break;

    case 'remoteconnect':
      const remotechannel = bot.channels.get(args[1]);
      if (!remotechannel) return console.error("The channel does not exist!");
      remotechannel.join().then(connection => {
        // Yay, it worked!
        console.log("Successfully connected.");
      }).catch(e => {
        // Oh no, it errored! Let's log it to console :)
        console.error(e);
      });
    break;

    case 'leave':
      var currentchan = message.member.voiceChannel;
      if (!currentchan) return console.error("Channel doesn't exist");
      currentchan.leave()
      message.channel.send('Goodbye :P');
      break;

    case 'play':
      const channel = message.member.voiceChannel;
      if (!channel) return console.error("The channel does not exist!");
      channel.join().then(connection => {
        console.log("joined channel");
        const stream = ytdl(args[1], { filter: 'audioonly' });
        const dispatcher = connection.playStream(stream, streamOptions);
      }).catch(err => console.log(err));
      break;

    case 'femurbreaker':
      var vchannel = message.member.voiceChannel;
      if (!vchannel) return console.error("The channel does not exist!");
      vchannel.join().then(connection => {
        console.log("joined channel");
        const stream = ytdl('https://www.youtube.com/watch?v=08L9sNuik5M', { filter: 'audioonly' });
        const dispatcher = connection.playStream(stream, streamOptions);
      }).catch(err => console.log(err));
      break;

    case 'avatar':
      if (!message.mentions.users.size) {
        return message.channel.send(
          `Your avatar: ${message.author.displayAvatarURL}`
        );
      }
      const avatarList = message.mentions.users.map(user => {
        return `${user.username}\'s avatar: ${user.displayAvatarURL}`;
      });
      message.channel.send(avatarList);

      break;

    case 'clear':
      if (ownerSent) {
        if (!args[1]) return message.reply('Please enter number of messages');
        message.channel.bulkDelete(args[1]);
        message.channel.send('Gone.');
      } else {
        message.reply("You don't have permission");
      }
      break;

    case 'broadcast':
      var targchannel = bot.channels.get(args[1])
      targchannel.send(args.slice(2).join(' '))
      break;

    case 'warn':
      let mentionedUser = message.mentions.users.first();
      if (message.member.hasPermission('MANAGE_GUILD')) {
        let reason = args.slice(2).join(' ');
        mentionedUser.send(`**You were warned for** : ` + reason);
      } else {
        message.channel.sendMessage('You do not have enough permission');
      }
      break;

    case 'pm':
      let mentionedUserPm = message.mentions.users.first();
      if (ownerSent) {
        let pm = args.slice(2).join(' ');
        mentionedUserPm.send(pm);
        message.delete();
      } else {
        message.channel.sendMessage('You do not have enough permission');
      }
      break;

    case 'say':
      if (!message.author.bot) {
        const output = message.content.substring(Prefix.length + 3);
        if (output.includes('@everyone')) {
          return message.reply("Don't ping everyone!");
        }
        if (output.includes('@here')) {
          return message.reply("Don't ping here!");
        }
        message.channel.send(message.content.substring(Prefix.length + 3));
        if (message.channel.type === 'text') {
          message.delete();
        }
      } else {
        message.channel.send('Stop trying to break me.');
      }
      break;

    case 'serverinfo':
      let verifLevels = [
        'None',
        'Low',
        'Medium',
        '(╯°□°）╯︵  ┻━┻',
        '┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻'
      ];

      let region = {
        brazil: ':flag_br: Brazil',
        'eu-central': ':flag_eu: Central Europe',
        singapore: ':flag_sg: Singapore',
        'us-central': ':flag_us: U.S. Central',
        sydney: ':flag_au: Sydney',
        'us-east': ':flag_us: U.S. East',
        'us-south': ':flag_us: U.S. South',
        'us-west': ':flag_us: U.S. West',
        'eu-west': ':flag_eu: Western Europe',
        'vip-us-east': ':flag_us: VIP U.S. East',
        london: ':flag_gb: London',
        amsterdam: ':flag_nl: Amsterdam',
        hongkong: ':flag_hk: Hong Kong',
        russia: ':flag_ru: Russia',
        southafrica: ':flag_za:  South Africa'
      };

      const embed = new Discord.RichEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField('Name', message.guild.name, true)
        .addField('ID', message.guild.id, true)
        .addField('Region', region[message.guild.region], true)
        .addField(
          'Total | Humans | Bots',
          `${message.guild.members.size} | ${
          message.guild.members.filter(member => !member.user.bot).size
          } | ${message.guild.members.filter(member => member.user.bot).size}`,
          true
        )
        .addField(
          'Verification Level',
          verifLevels[message.guild.verificationLevel],
          true
        )
        .addField('Channels', message.guild.channels.size, true)
        .addField('Roles', message.guild.roles.size, true)
        .addField(
          'Creation Date',
          `${message.channel.guild.createdAt
            .toUTCString()
            .substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`,
          true
        )
        .setThumbnail(message.guild.iconURL);
      message.channel.send(embed);
      break;

    case 'userinfo':
      let user = message.mentions.users.first() || message.author;
      const userinfo = new Discord.RichEmbed()
        .setTitle('User Info')
        .addField('Username: ', user.username)
        .addField('UserID: ', user.id)
        .setThumbnail(user.avatarURL)
        .setColor(0x000000)
        .setFooter('My Prefix is f!');
      message.channel.send(userinfo);
      break;

    case 'SCP':
      if (!args[1]) return message.reply('Please enter an SCP number.');
      if (args[1] < 001 || args[1] > 5000)
        return message.reply('This SCP does not exist.');
      else {
        message.channel.send('http://www.scp-wiki.net/scp-' + args[1]);
      }
      break;

    case 'spam':
      if (ownerSent) {
        if (!args[1]) return message.reply('Enter a message to spam!');
        for (let i = 0; i < 100; i++) {
          const output = message.content.substring(Prefix.length + 4);
          message.channel.send(message.content.substring(Prefix.length + 4));
        }
      } else {
        message.reply('You do not have high enough clearance!');
      }
      break;

    case 'kick':
      if (!ownerSent)
        return message.reply("You don't have high enough clearance!");
      if (ownerSent) {
        if (!args[1]) return message.reply('Please enter a user to kick');
        var mem = message.mentions.members.first();
        mem.kick().then(member => {
          message.channel.send(member.displayName + ' is in horny jail. ');
        });
      }
      break;

    case 'ban':
      if (!ownerSent)
        return message.reply("You don't have a high enough clearance!");
      if (ownerSent) {
        if (!args[1]) return message.reply('Please enter a user to ban');
        var member = message.mentions.members.first();
        member.ban().then(member => {
          message.channel.send(member.displayName + ' is in horny jail. ');
        });
      }
      break;

    case 'ping':
      message.reply('Pong!');
      break;

    case 'help':
      if (args[1]) {
        const help2 = new Discord.RichEmbed()
          .setTitle('Commands (Page 2/2)')
          .addField(
            '**SCP**',
            'Displays a link to any SCP from the official SCP Wiki.'
          )
          .addField('**kick**', 'Kicks a user when you tag them.')
          .addField('**ban**', 'Bans a user when you tag them.')
          .addField('**ping**', 'Test if the bot works and responds.')
          .addField('**kill**', "Don't.")
          .addField('**reset**', 'Restarts the bot.')
          .addField('**play**', 'Plays audio of a youtube link.')
          .addField('**skip**', 'Skips a song.')
          .addField('**stop**', 'Stops playing audio.')
          .setColor(0x000000)
          .setFooter('My Prefix is "f!"');
        message.channel.send(help2);
      }
      else {
        const help = new Discord.RichEmbed()
          .setTitle('Commands (Page 1/2)')
          .addField('**status**', 'Shows the status of the bot.')
          .addField('**avatar**', 'Displays an image of a given avatar.')
          .addField('**clear**', 'Clears a given number of messages.')
          .addField('**connect**', 'Joins the voice channel you are in.')
          .addField('**leave**', 'Leaves the voice channel you are in.')
          .addField('**help**', 'Shows all commands the bot currently has.')
          .addField('**say**', 'Make bot say a message of your choice.')
          .addField('**serverinfo**', 'Check the info of this server.')
          .addField(
            '**userinfo**',
            'Check info about yourself or a tagged user.'
          )
          .setColor(0x000000)
          .setFooter('My Prefix is "f!"');
        message.channel.send(help);
      }
    break;

    case 'kill':
      if (ownerSent) {
        message.channel.send('Femboy succesfully contained... I will be back...');
        bot.destroy();
      } else {
        message.reply("You don't have high enough clearance!");
      }
      break;

    case 'reset':
      if (ownerSent) {
        message.reply('Bot restarting!');
        bot.destroy();
        bot.login(token);
        message.reply('I am back Onee-chan!');
      } else {
        message.reply("You don't have high enough clearance!");
      }
      break;
  }
});

bot.login(token);
