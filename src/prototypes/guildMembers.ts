import { Collection, GuildMember, GuildMemberManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings } from "../utils";

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

  searchBy<T extends string>(query: T): GuildMember | undefined;
  searchBy<T extends RegExp>(query: T): GuildMember | undefined;
  searchBy<T extends Search>(query: T): GuildMember | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): GuildMember | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, GuildMember>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return this.cache.find((member) =>
      (
        query.id && (
          typeof query.id === "string" ?
            compareStrings(query.id, member.id) :
            query.id.test(member.id)
        )
      ) || (
        query.displayName && (
          typeof query.displayName === "string" ?
            compareStrings(query.displayName, member.displayName) :
            query.displayName.test(member.displayName)
        )
      ) || (
        query.globalName && member.user.globalName && (
          typeof query.globalName === "string" ?
            compareStrings(query.globalName, member.user.globalName) :
            query.globalName.test(member.user.globalName)
        )
      ) || (
        query.nickname && member.nickname && (
          typeof query.nickname === "string" ?
            compareStrings(query.nickname, member.nickname) :
            query.nickname.test(member.nickname)
        )
      ) || (
        query.username && (
          typeof query.username === "string" ?
            compareStrings(query.username, member.user.username) :
            query.username.test(member.user.username)
        )
      ));
  }

  protected _searchByMany(queries: (string | RegExp | Search)[]) {
    const cache: this["cache"] = new Collection();
    for (const query of queries) {
      const result = this.searchBy(query);
      if (result) cache.set(result.id, result);
    }
    return cache;
  }

  protected _searchByRegExp(query: RegExp) {
    return this.cache.find((member) =>
      query.test(member.id) ||
      query.test(member.displayName) ||
      query.test(member.user.username) ||
      (member.nickname && query.test(member.nickname)) ||
      (member.user.globalName && query.test(member.user.globalName)));
  }

  protected _searchByString(query: string) {
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
  id?: string | RegExp
  displayName?: string | RegExp
  globalName?: string | RegExp
  nickname?: string | RegExp
  username?: string | RegExp
}
