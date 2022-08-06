/*
 * This is an integration example that shows how to use this package
 * in TypeScript. It also allows to test that the typings generated
 * when building the package properly works.
 */

import { Client, GatewayIntentBits, version } from "discord.js";
import { VoiceRoleManager } from "discordjs-voicerole";

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
config[process.env.CHANNEL as string] = [process.env.ROLE];
const manager = new VoiceRoleManager(config);

// Create the client and connect it to the manager.
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

// Main part!
client.on("voiceStateUpdate", (old, cur) => {
  // Delegate the behaviour to the VoiceManager.
  manager.trigger(old, cur);

  // Some debug to assert things in the terminal.
  console.log({
    old:
      old.channel && old.member
        ? {
            channel: old.channel.id,
            user: old.member.id,
          }
        : "<null>",
    new:
      cur.channel && cur.member
        ? {
            channel: cur.channel.id,
            user: cur.member.id,
          }
        : "<null>",
  });
});

// Start the bot.
client.on("ready", () => console.log("The bot is online using", version));
client.login(process.env.BOT_TOKEN);

// Stop the bot when the process is closed (via Ctrl-C).
process.on("SIGINT", () => client.destroy());
process.on("SIGTERM", () => client.destroy());
