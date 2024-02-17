import { Client, Collection, GuildMemberManager, GuildMember } from "discord.js";
import { isRegExp } from "util/types";

export class GuildMembers {
  declare cache: Collection<string, GuildMember>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(GuildMemberManager.prototype, {
      getById: { value: this.getById },
      getByDisplayName: { value: this.getByDisplayName },
      getByNickname: { value: this.getByNickname },
      getByUserDisplayName: { value: this.getByUserDisplayName },
      getByUserGlobalName: { value: this.getByUserGlobalName },
      getByUserUsername: { value: this.getByUserUsername },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByDisplayName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (typeof name === "string") {
        return member.displayName === name;
      }

      return name.test(member.displayName);
    });
  }

  getByNickname(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (!member.nickname) return false;

      if (typeof name === "string") {
        return member.nickname === name;
      }

      return name.test(member.nickname);
    });
  }

  getByUserDisplayName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (typeof name === "string") {
        return member.user.displayName === name;
      }

      return name.test(member.user.displayName);
    });
  }

  getByUserGlobalName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (member.user.globalName === null) return false;

      if (typeof name === "string") {
        return member.user.globalName === name;
      }

      return name.test(member.user.globalName);
    });
  }

  getByUserUsername(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (typeof name === "string") {
        return member.user.username === name;
      }

      return name.test(member.user.username);
    });
  }

}
