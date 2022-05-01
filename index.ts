import { Snowflake, VoiceState } from "discord.js";

/**
 * The configuration object is a map (JavaScript object) where keys are
 * the snowflakes of voice channels where you want the bot to kick in
 * when someone connects or disconnects. The value assigned to each
 * key are the role or roles to assign on connect, and to remove on
 * disconnect.
 */
export type VoiceChannelConfiguration = Record<
  Snowflake, // the snowflake of the voice channel to monitor
  Snowflake | Snowflake[] // the snowflake or snowflake of roles to add
>;

/**
 * The voice role manager is the class that manages the role assignment
 * and releasement whenever an user joins or leaves a voice channel
 * that is managed by the config object.
 */
export class VoiceRoleManager {
  constructor(private config: VoiceChannelConfiguration) {}

  /**
   * Passes the outcome of the voiceStateChange event, adding or
   * removing the members from the roles depending on the current
   * state of the user.
   *
   * @param oldState old voice state object coming from the event
   * @param newState new voice state object coming from the event
   */
  trigger(oldState: VoiceState, newState: VoiceState): void {
    if (oldState.member != newState.member) {
      /* TODO: Can this happen? */
      return;
    }

    if (oldState.channelId === newState.channelId) {
      /* On mutes, the channelId doesn't actually change. */
      return;
    }

    if (oldState.channelId) {
      /* This is the channel that the member has left. */
      const roles = this.roles(oldState.channelId);
      roles.forEach((role) =>
        oldState.member.roles.remove(role).catch((e) => {
          console.error(`Could not delete member from role: ${e}`);
        })
      );
    }
    if (newState.channelId) {
      /* This is the channel that the member has joined. */
      const roles = this.roles(newState.channelId);
      roles.forEach((role) =>
        newState.member.roles.add(role).catch((e) => {
          console.error(`Could not add member to role: ${e}`);
        })
      );
    }
  }

  /** Coerces the roles for a config to an array. */
  private roles(id: Snowflake): Snowflake[] {
    const value = this.config[id];
    if (!value) {
      return []; /* no roles? */
    } else if (Array.isArray(value)) {
      return value; /* already an array. */
    } else {
      return [value]; /* upgrade to array. */
    }
  }
}
