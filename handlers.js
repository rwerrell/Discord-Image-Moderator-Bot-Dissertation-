/* This code is importing the `checkImage` and `checkImageValidity` functions from a file called
`functions.js`, as well as the `EmbedBuilder` class from the `discord.js` library. It is also
declaring a variable called `loggingChannelId` using the `let` keyword. */
const { checkImage, checkImageValidity } = require('./functions.js');
const { EmbedBuilder } = require('discord.js');
let loggingChannelId;

/**
 * This function checks if an image attached to a message is appropriate and logs it if it is not.
 * @param message - The message object that triggered the message handler function. It contains
 * information about the message, such as the content, author, channel, and any attachments.
 */
function messageHandler(message) {
  const channelMention = `<#${message.channel.id}>`;
  const userMentionImage = `<@${message.author.id}>`;
  if (message.attachments.size > 0) {
    message.attachments.forEach(async (attachment) => {
      console.log(`Received image: ${attachment.url}`);
      const isValid = checkImageValidity(attachment.url);
      if (isValid) {
        try {
          const { response, inappropriateImage } = await checkImage(attachment.url);
          if (inappropriateImage) {
            if (typeof loggingChannelId === 'undefined') {
              message.channel.send('Please set up the logging channel with the /setup command. You may need a staff member to do this.');
            } else {
              console.log('Image is inappropriate.');
              message.client.channels.cache.get(loggingChannelId).send({
                embeds: [
                  new EmbedBuilder()
                    .setTitle('Inappropriate Image detected.')
                    .setDescription('Inappropriate image detected posted in the channel: ' + channelMention +
                      '\nPosted by: ' + userMentionImage +
                      ('\nAPI Response: ' + (JSON.stringify(response.data, null, 2))))
                    .setAuthor({ name: message.client.user.tag, iconURL: message.client.user.defaultAvatarURL })
                    .setColor('#FF0000'),
                ],
              });
            }
          } else {
            console.log('Image is appropriate.');
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('Image is not valid.');
        if (typeof loggingChannelId === 'undefined') {
          message.channel.send('Please set up the logging channel with the /setup command. You may need a staff member to do this.');
        } else {
          message.client.channels.cache.get(loggingChannelId).send({
            embeds: [
              new EmbedBuilder()
                .setTitle('Image unable to be analyzed.')
                .setDescription('Invalid image type detected, posted in the channel:' + channelMention +
                  '\nThe image was posted by: ' + userMentionImage + ' and was unable to be analysed.')
                .setAuthor({ name: message.client.user.tag, iconURL: message.client.user.defaultAvatarURL })
                .setColor('#FFBF00'),
            ],
          });
        }
      }
    });
  }
}

/**
 * The function checks if a member's profile picture is inappropriate and sends a message to a logging
 * channel if it is.
 * @param member - The "member" parameter is an object representing a Discord guild member. It is
 * likely passed into this function when a member joins the server or updates their profile picture.
 * The function then checks if the member's profile picture is appropriate using the "checkImage"
 * function and sends a message to a logging channel
 */
const profilePictureHandler = async (member) => {
  const profilePicture = member.displayAvatarURL();
  const userMentionAvatar = `<@${member.id}>`;
  try {
    const { response, inappropriateImage } = await checkImage(profilePicture);
    if (inappropriateImage) {
      member.client.channels.cache.get(loggingChannelId).send({
        embeds: [
          new EmbedBuilder()
            .setTitle('Inappropriate Avatar detected.')
            .setDescription('Inappropriate Avatar of: ' + userMentionAvatar +
            ('\nAPI Response: ' + (JSON.stringify(response.data, null, 2))))
            .setAuthor({ name: member.client.user.tag, iconURL: member.client.user.defaultAvatarURL })
            .setColor('#FF0000'),
        ],
      });
    } else {
      console.log('Image is appropriate.');
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * The function updates the logging channel ID.
 * @param channelID - The channelID parameter is a string or integer representing the ID of the logging
 * channel that you want to update. This function sets the loggingChannelId variable to the value of
 * channelID, which can then be used to send log messages to the specified channel.
 */
function updateLoggingChannel(channelID) {
  loggingChannelId = channelID;
}


/* `module.exports` is a special object in Node.js that defines what should be exported from a module.
In this case, the module is exporting three functions: `messageHandler`, `updateLoggingChannel`, and
`profilePictureHandler`. These functions can be imported and used in other parts of the codebase. */
module.exports = { messageHandler, updateLoggingChannel, profilePictureHandler };
