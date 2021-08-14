/* eslint-disable @typescript-eslint/no-explicit-any */
import * as chai from "chai";
import { stub } from "sinon";
import sinonChai from "sinon-chai";
import "mocha";

import { GuildMember, Snowflake, VoiceState } from "discord.js";
import VoiceRoleManager from ".";

chai.use(sinonChai);
const expect = chai.expect;

const configObject = {
  "20001": "40001",
  "20002": ["40002", "40003"],
};

describe("VoiceRole", () => {
  let mockMember: GuildMember;

  beforeEach(() => {
    mockMember = {
      roles: {
        add: stub().returns(Promise.resolve()),
        remove: stub().returns(Promise.resolve()),
      },
    } as any;
  });

  function voiceEvent(channelId?: Snowflake): VoiceState {
    return { member: mockMember, channelId: channelId } as any;
  }

  describe("when the user joins a channel", () => {
    it("does nothing if the channel is not tracked", () => {
      const voiceRole = new VoiceRoleManager(configObject);
      voiceRole.trigger(voiceEvent(null), voiceEvent("20000"));
      expect(mockMember.roles.add).not.to.have.been.called;
    });

    it("adds the member to a role if the role is single", () => {
      const voiceRole = new VoiceRoleManager(configObject);
      voiceRole.trigger(voiceEvent(null), voiceEvent("20001"));
      expect(mockMember.roles.add).to.be.calledWith("40001");
    });

    it("adds the member to roles if the role is an array", () => {
      const voiceRole = new VoiceRoleManager(configObject);
      voiceRole.trigger(voiceEvent(null), voiceEvent("20002"));
      expect(mockMember.roles.add).to.be.calledWith("40002");
      expect(mockMember.roles.add).to.be.calledWith("40003");
    });
  });

  describe("when the user leaves a channel in the config object", () => {
    it("does nothing if the channel is not tracked", () => {
      const voiceRole = new VoiceRoleManager(configObject);
      voiceRole.trigger(voiceEvent("20000"), voiceEvent(null));
      expect(mockMember.roles.remove).not.to.have.been.called;
    });

    it("removes the member from tje role if the role is single", () => {
      const voiceRole = new VoiceRoleManager(configObject);
      voiceRole.trigger(voiceEvent("20001"), voiceEvent(null));
      expect(mockMember.roles.remove).to.be.calledWith("40001");
    });

    it("adds the member to roles if the role is an array", () => {
      const voiceRole = new VoiceRoleManager(configObject);
      voiceRole.trigger(voiceEvent("20002"), voiceEvent(null));
      expect(mockMember.roles.remove).to.be.calledWith("40002");
      expect(mockMember.roles.remove).to.be.calledWith("40003");
    });
  });

  describe("when the user switches a channel", () => {
    describe("when the origin channel is not tracked", () => {
      it("does nothing if the destination channel is not tracked", () => {
        const voiceRole = new VoiceRoleManager(configObject);
        voiceRole.trigger(voiceEvent("20000"), voiceEvent("20005"));
        expect(mockMember.roles.remove).not.to.have.been.called;
        expect(mockMember.roles.add).not.to.have.been.called;
      });

      it("adds a role if the destination channel is tracked", () => {
        const voiceRole = new VoiceRoleManager(configObject);
        voiceRole.trigger(voiceEvent("20000"), voiceEvent("20001"));
        expect(mockMember.roles.remove).not.to.have.been.called;
        expect(mockMember.roles.add).to.be.calledWith("40001");
      });
    });

    describe("when the origin channel is tracked", () => {
      it("removes a role if the destination channel is not tracked", () => {
        const voiceRole = new VoiceRoleManager(configObject);
        voiceRole.trigger(voiceEvent("20001"), voiceEvent("20005"));
        expect(mockMember.roles.remove).to.be.calledWith("40001");
        expect(mockMember.roles.add).not.to.have.been.called;
      });

      it("removes and add roles when both channels are tracked", () => {
        const voiceRole = new VoiceRoleManager(configObject);
        voiceRole.trigger(voiceEvent("20001"), voiceEvent("20002"));
        expect(mockMember.roles.remove).to.be.calledWith("40001");
        expect(mockMember.roles.add).to.be.calledWith("40002");
        expect(mockMember.roles.add).to.be.calledWith("40003");
      });
    });
  });
});
