const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

/* This code block is iterating through each folder in the "commands" directory and then iterating
through each file in each folder that ends with ".js". For each file, it is checking if it has both
a "data" and "execute" property, and if it does, it is pushing the command's data (converted to JSON
format) into the "commands" array. If the file is missing either of the required properties, it logs
a warning message to the console. */
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}
/* This code block is using the Discord.js library to refresh the application commands for a specific
Discord bot. It creates a new REST object and sets the token for the bot using the `setToken()`
method. Then, it uses an asynchronous function to send a PUT request to the Discord API to update
the application commands for a specific guild. The `Routes.applicationGuildCommands()` method is
used to specify the endpoint for updating guild commands, and the `commands` array is passed as the
body of the request. If the request is successful, it logs a message to the console indicating the
number of commands that were reloaded. If there is an error, it logs the error to the console. */
const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);


    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
