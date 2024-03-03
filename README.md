# Discord Image Moderator Bot

**A Discord image moderation bot for use within the University of Portsmouth Discord.**

This project was built with the use of the [SightEngine](https://sightengine.com/) image analysis API.

## Built using

- [Node.js](https://nodejs.org/en)

- [Axios](https://axios-http.com)

- [Discord.js](https://discord.js.org)

- [SightEngine](https://sightengine.com/)

- [Jest](https://jestjs.io/docs/getting-started)

## How to setup

1. Clone this repo - `git clone`

2. Install node from the website linked above.

3. Run `node -v` to ensure its installed correctly.

4. Install discord.js with  `npm install discord.js`

5. Check you have the correct version with `npm list discord.js` (needs to be v14+)

6. Install axios with `npm install axios`.

7. Create a application on the [Discord developer portal](https://discord.com/developers/applications)

8. Invite the bot to a server under the OAuth2 -> URL generator, make sure it has the bot scope aswell as administrator.

9. Create an account on [SightEngine](https://sightengine.com/)  to gain access to the API.

10. Create a **config.json** file and add in:

    1. Bot token available on developer portal.

    2. User token from the image analysis API on [SightEngine](https://sightengine.com/)

    3. Include a categories to adjust what the API looks for.

        - nudity-2.0 (Checks for nudity.)
        - wad (Checks for weapons,alcohol and drugs.)
        - offensive (Checks for offensive signs and gestures.)
        - scam (Checks for scammers.)
        - text-content (Checks for profanity,emails and phone numbers.)
        - gore (Checks for gore,horrific imagery and content with blood.)
        - text (Checks for text added after inital image.)
        - qr-content (Checks for QR codes.)
        - tobacco (Checks for smoking and tobacco products.)
        - money (Checks for money.)
        - gambling ( Checks for gambling.)
    4. Secret API token on [SightEngine](https://sightengine.com/)

    5. clientID from the developer portal.

    6. guildID (server ID), the ID of the server you wish to run this bot on.

11. Run `node deploy-commands.js` & `node index.js`. In that order,

12. Run the /setup command in the actual Discord server.

13. Enjoy the image moderation with logging.

## How to run the tests

1. Install jest as developer dependency.

    - `npm install --save-dev jest`

2. Add the following to the package.json file

    - `{ "scripts": { "test": "jest"  } }`

3. Run `npm test` to run the pre existing tests.
