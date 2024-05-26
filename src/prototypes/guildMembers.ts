import { Collection, GuildMemberManager, type GuildMember } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings, replaceMentionCharacters } from "../utils";

export class GuildMembers {
  declare cache: GuildMemberManager["cache"];

  constructor() {
    Object.defineProperties(GuildMemberManager.prototype, {
      getById: { value: this.getById },
      getByDisplayName: { value: this.getByDisplayName },
      getByNickname: { value: this.getByNickname },
      getByUserDisplayName: { value: this.getByUserDisplayName },
      getByUserGlobalName: { value: this.getByUserGlobalName },
      getByUserUsername: { value: this.getByUserUsername },
      searchBy: { value: this.searchBy },
      _searchByMany: { value: this._searchByMany },
      _searchByRegExp: { value: this._searchByRegExp },
      _searchByString: { value: this._searchByString },
    });
  }

  /** @DJSProtofy */
  getById(id: string) {
    return this.cache.get(id);
  }

  /** @DJSProtofy */
  getByDisplayName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (typeof name === "string") {
        return compareStrings(member.displayName, name);
      }

      return name.test(member.displayName);
    });
  }

  /** @DJSProtofy */
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

  /** @DJSProtofy */
  getByUserDisplayName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (typeof name === "string") {
        return compareStrings(member.user.displayName, name);
      }

      return name.test(member.user.displayName);
    });
  }

  /** @DJSProtofy */
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

  /** @DJSProtofy */
  getByUserUsername(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(member => {
      if (typeof name === "string") {
        return compareStrings(member.user.username, name);
      }

      return name.test(member.user.username);
    });
  }

  /** @DJSProtofy */
  searchBy<T extends string>(query: T): GuildMember | undefined;
  searchBy<T extends RegExp>(query: T): GuildMember | undefined;
  searchBy<T extends Search>(query: T): GuildMember | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): GuildMember | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, GuildMember>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return typeof query.id === "string" && this.cache.get(query.id) ||
      this.cache.find(member =>
        typeof query.displayName === "string" && compareStrings(query.displayName, member.displayName) ||
        isRegExp(query.displayName) && query.displayName.test(member.displayName) ||
        typeof query.username === "string" && compareStrings(query.username, member.user.username) ||
        isRegExp(query.username) && query.username.test(member.user.username) ||
        typeof member.nickname === "string" && (
          typeof query.nickname === "string" && compareStrings(query.nickname, member.nickname) ||
          isRegExp(query.nickname) && query.nickname.test(member.nickname)
        ) ||
        typeof member.user.globalName === "string" && (
          typeof query.globalName === "string" && compareStrings(query.globalName, member.user.globalName) ||
          isRegExp(query.globalName) && query.globalName.test(member.user.globalName)
        ));
  }

  /** @DJSProtofy */
  protected _searchByMany(queries: (string | RegExp | Search)[]) {
    const cache: this["cache"] = new Collection();
    for (const query of queries) {
      const result = this.searchBy(query);
      if (result) cache.set(result.id, result);
    }
    return cache;
  }

  /** @DJSProtofy */
  protected _searchByRegExp(query: RegExp) {
    return this.cache.find((member) =>
      query.test(member.displayName) ||
      query.test(member.user.username) ||
      (member.nickname && query.test(member.nickname)) ||
      (typeof member.user.globalName === "string" && query.test(member.user.globalName)));
  }

  /** @DJSProtofy */
  protected _searchByString(query: string) {
    query = replaceMentionCharacters(query);
    return this.cache.get(query) ??
      this.cache.find((member) => [
        member.displayName?.toLowerCase(),
        member.nickname?.toLowerCase(),
        member.user.globalName?.toLowerCase(),
        member.user.username?.toLowerCase(),
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string
  displayName?: string | RegExp
  globalName?: string | RegExp
  nickname?: string | RegExp
  username?: string | RegExp
}
