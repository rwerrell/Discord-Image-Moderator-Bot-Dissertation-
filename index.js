const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const { messageHandler, profilePictureHandler } = require('./handlers.js');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

/* This code is dynamically loading all the command files from the `commands` directory and adding them
to a `Collection` object called `client.commands`. */
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}


/* This code sets up a listener for the `ClientReady` event, which is emitted when the client has
successfully connected to Discord. Once the event is triggered, the code logs a message to the
console indicating that the client is ready and logged in as the user with the tag `c.user.tag`. It
also sets the client's presence to "Playing /setup" using the `client.user.setPresence()` method.
This will display the message "/setup" as the client's current activity in Discord. */
client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  client.user.setPresence({
    activities: [{ name: '/setup', type: ActivityType.Playing }],
  });
});

/* This code sets up a listener for the `InteractionCreate` event, which is emitted when a user
interacts with a slash command in Discord. The code then checks if the interaction is a chat input
command and retrieves the corresponding command from the `client.commands` collection based on the
command name. If no matching command is found, an error message is logged to the console. */
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  /* This code block is handling the execution of a slash command in Discord. It tries to execute the
command by calling the `execute` method of the corresponding command object, passing in the
`interaction` object as an argument. If an error occurs during the execution of the command, the
`catch` block is triggered. The error is logged to the console using `console.error()`, and an error
message is sent to the user who triggered the command using the `interaction.reply()` or
`interaction.followUp()` method, depending on whether the interaction has already been replied to or
deferred. The `ephemeral` option is set to `true` to ensure that the error message is only visible
to the user who triggered the command. */
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

/* This code sets up a listener for the `guildMemberAdd` event, which is emitted when a new member
joins a guild (server) in Discord. When the event is triggered, the `profilePictureHandler` function
is called with the `member` object as an argument. The `profilePictureHandler` function is
responsible for setting the new member's profile picture to a default image. */
client.on('guildMemberAdd', (member) => {
  profilePictureHandler(member);
});

/* `client.on('messageCreate', messageHandler);` is setting up a listener for the `messageCreate`
event, which is emitted when a new message is created in a channel that the bot has access to. When
the event is triggered, the `messageHandler` function is called with the `message` object as an
argument. The `messageHandler` function is responsible for processing the message and executing the
corresponding command, if any. */
client.on('messageCreate', messageHandler);


/* `client.login(token);` is logging the client into Discord using the provided token. The token is a
unique identifier for the bot's account and is required to establish a connection to Discord's API. */
client.login(token);
