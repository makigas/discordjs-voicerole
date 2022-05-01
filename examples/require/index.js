/*
 * This is an integration example that shows how to use this package
 * in JavaScript when the project is making use of CommonJS system
 * (so you import using "require").
 */

const { Client, Intents } = require("discord.js");
const { VoiceRoleManager } = require("discordjs-voicerole");

// Make sure that all the three environment variables are declared.
["BOT_TOKEN", "ROLE", "CHANNEL"].forEach((env) => {
  if (!process.env[env]) {
    console.error(`Missing environment variable: ${env}`);
    process.exit(1);
  }
});

// Build the voice role manager. It accepts the configuration as a
// parameter. The configuration is a map, where keys are the snowflake
// of a voice channel, and the values are an array of roles to assign
// and unassign.
const config = {};
config[process.env.CHANNEL] = [process.env.ROLE];
const manager = new VoiceRoleManager(config);

// Create the client and connect it to the manager.
const client = new Client({
  intents: Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_VOICE_STATES,
});

// Main part!
client.on("voiceStateUpdate", (old, cur) => {
  // Delegate the behaviour to the VoiceManager.
  manager.trigger(old, cur);

  // Some debug to assert things in the terminal.
  console.log({
    old: old.channel
      ? {
          channel: old.channel.id,
          user: old.member.id,
        }
      : "<null>",
    new: cur.channel
      ? {
          channel: cur.channel.id,
          user: cur.member.id,
        }
      : "<null>",
  });
});

// Start the bot.
client.on("ready", () => console.log("The bot is online"));
client.login(process.env.BOT_TOKEN);

// Stop the bot when the process is closed (via Ctrl-C).
process.on("SIGINT", () => client.destroy());
process.on("SIGTERM", () => client.destroy());
