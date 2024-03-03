const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { updateLoggingChannel } = require('../../handlers.js');

/* This code exports an object that contains a SlashCommandBuilder object with the name "setup" and a
description for a Discord bot command. The command has a required channel option that can only be a
GuildText channel. The execute function is an asynchronous function that retrieves the name of the
channel selected by the user, sends a message confirming the channel selection, retrieves the ID of
the selected channel, logs the channel ID and name to the console, and calls the
updateLoggingChannel function with the channel ID as an argument. */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Used to setup the Image moderation bot.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel that you wish to use for logging')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const channelName = interaction.options.getChannel('channel').name;
    await interaction.reply('The channel that will be used for logging will be: ' + channelName + '.');
    const loggingChannel = interaction.options.getChannel('channel').id;
    console.log(loggingChannel + ' ' + channelName);
    updateLoggingChannel(loggingChannel);
  },
};
