import { Client, Collection, GuildMember, GuildMemberManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings } from "../utils";

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
      searchBy: { value: this.searchBy },
      _searchByString: { value: this._searchByString },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByDisplayName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (typeof name === "string") {
        return compareStrings(member.displayName, name);
      }

      return name.test(member.displayName);
    });
  }

  getByNickname(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (member.nickname === null) return false;

      if (typeof name === "string") {
        return compareStrings(member.nickname, name);
      }

      return name.test(member.nickname);
    });
  }

  getByUserDisplayName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (typeof name === "string") {
        return compareStrings(member.user.displayName, name);
      }

      return name.test(member.user.displayName);
    });
  }

  getByUserGlobalName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (member.user.globalName === null) return false;

      if (typeof name === "string") {
        return compareStrings(member.user.globalName, name);
      }

      return name.test(member.user.globalName);
    });
  }

  getByUserUsername(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (typeof name === "string") {
        return compareStrings(member.user.username, name);
      }

      return name.test(member.user.username);
    });
  }

  searchBy(query: string | Search) {
    if (typeof query === "string") return this._searchByString(query);

    return this.cache.find((member) => compareStrings(query.id!, member.id) ||
      compareStrings(query.displayName!, member.displayName) ||
      compareStrings(query.nickname!, member.nickname!) ||
      compareStrings(query.globalName!, member.user.globalName!) ||
      compareStrings(query.username!, member.user.username));
  }

  protected _searchByString(query: string) {
    return this.cache.find((member) => [
      member.id,
      member.displayName.toLowerCase(),
      member.nickname?.toLowerCase(),
      member.user.globalName?.toLowerCase(),
      member.user.username.toLowerCase(),
    ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string
  displayName?: string
  globalName?: string
  nickname?: string
  username?: string
}
