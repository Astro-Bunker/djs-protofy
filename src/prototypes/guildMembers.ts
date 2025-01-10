import { Collection, GuildMemberManager, type GuildMember, type RoleResolvable } from "discord.js";
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
      filterByRole: { value: this.filterByRole },
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
    if (typeof name === "string") return this.cache.find(cached => name.equals(cached.displayName, true));

    if (isRegExp(name)) return this.cache.find(cached => name.test(cached.displayName));
  }

  /** @DJSProtofy */
  getByNickname(name: string | RegExp) {
    if (typeof name === "string") return this.cache.find(cached =>
      typeof cached.nickname === "string" &&
      name.equals(cached.nickname, true));

    if (isRegExp(name)) return this.cache.find(cached =>
      typeof cached.nickname === "string" &&
      name.test(cached.nickname));
  }

  /** @DJSProtofy */
  getByUserDisplayName(name: string | RegExp) {
    if (typeof name === "string") return this.cache.find(cached => name.equals(cached.user.displayName, true));

    if (isRegExp(name)) return this.cache.find(cached => name.test(cached.user.displayName));
  }

  /** @DJSProtofy */
  getByUserGlobalName(name: string | RegExp) {
    if (typeof name === "string") return this.cache.find(cached =>
      typeof cached.user.globalName === "string" &&
      name.equals(cached.user.globalName, true));

    if (isRegExp(name)) return this.cache.find(cached =>
      typeof cached.user.globalName === "string" &&
      name.test(cached.user.globalName));
  }

  /** @DJSProtofy */
  getByUserUsername(name: string | RegExp) {
    if (typeof name === "string") return this.cache.find(cached => name.equals(cached.user.username, true));

    if (isRegExp(name)) return this.cache.find(cached => name.test(cached.user.username));
  }

  /** @DJSProtofy */
  filterByRole(role: RoleResolvable): Collection<string, GuildMember> {
    const roleId = this.cache.first()?.roles.resolveId(role);
    if (!roleId) return new Collection();
    return this.cache.filter(cached => cached.roles.cache.has(roleId));
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
      this.cache.find(cached =>
        typeof query.displayName === "string" && compareStrings(query.displayName, cached.displayName) ||
        isRegExp(query.displayName) && query.displayName.test(cached.displayName) ||
        typeof query.username === "string" && compareStrings(query.username, cached.user.username) ||
        isRegExp(query.username) && query.username.test(cached.user.username) ||
        typeof cached.nickname === "string" && (
          typeof query.nickname === "string" && compareStrings(query.nickname, cached.nickname) ||
          isRegExp(query.nickname) && query.nickname.test(cached.nickname)
        ) ||
        typeof cached.user.globalName === "string" && (
          typeof query.globalName === "string" && compareStrings(query.globalName, cached.user.globalName) ||
          isRegExp(query.globalName) && query.globalName.test(cached.user.globalName)
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
    return this.cache.find((cached) =>
      query.test(cached.displayName) ||
      query.test(cached.user.username) ||
      (cached.nickname && query.test(cached.nickname)) ||
      (typeof cached.user.globalName === "string" && query.test(cached.user.globalName)));
  }

  /** @DJSProtofy */
  protected _searchByString(query: string) {
    query = replaceMentionCharacters(query).toLowerCase();
    return this.cache.get(query) ??
      this.cache.find((cached) => [
        cached.displayName.toLowerCase(),
        cached.nickname?.toLowerCase(),
        cached.user.globalName?.toLowerCase(),
        cached.user.username.toLowerCase(),
      ].includes(query));
  }
}

interface Search {
  id?: string
  displayName?: string | RegExp
  globalName?: string | RegExp
  nickname?: string | RegExp
  username?: string | RegExp
}
