/*
 * This is a functional test to assert that the library behaves as
 * it should. Yes, you should write unit tests, but your unit test
 * will not talk to the real Discord. Run this script with ts-node
 * and let the bot play to assert that it is working as expected.
 * Also, you can use this file to learn how to use the library.
 */

import { Client, Intents } from "discord.js";
import { VoiceChannelConfiguration, VoiceRoleManager } from "./index";

if (!process.env.BOT_TOKEN || !process.env.ROLE || !process.env.CHANNEL) {
  console.error("Missing config");
  process.exit(1);
}
const token: string = process.env.BOT_TOKEN;
const role: string = process.env.ROLE;
const channel: string = process.env.CHANNEL;

const client = new Client({
  intents: Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_VOICE_STATES,
});

const config: VoiceChannelConfiguration = { [channel]: role };
const manager = new VoiceRoleManager(config);

client.on("ready", () => {
  console.log("Bot is online");
});

client.on("voiceStateUpdate", (old, cur) => {
  console.log({ old: old.channelId, cur: cur.channelId });
  if (old.channelId === cur.channelId) {
    console.log("old === cur");
  } else {
    manager.trigger(old, cur);
  }
});

client.login(token);
process.on("SIGINT", () => {
  client.destroy();
});
process.on("SIGTERM", () => {
  client.destroy();
});
