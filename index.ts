import { Snowflake, VoiceState } from "discord.js";

/** You can either assign a role or a list of roles to each channel. */
type VoiceChannelRoles = Snowflake | Snowflake[];

type VoiceChannelConfiguration = Record<Snowflake, VoiceChannelRoles>;

export default class VoiceRoleManager {
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
    if (oldState.channelID) {
      /* This is the channel that the member has left. */
      const roles = this.roles(oldState.channelID);
      roles.forEach((role) =>
        oldState.member.roles.remove(role).catch((e) => {
          console.error(`Could not delete member from role: ${e}`);
        })
      );
    }
    if (newState.channelID) {
      /* This is the channel that the member has joined. */
      const roles = this.roles(newState.channelID);
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
