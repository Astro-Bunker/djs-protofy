import { Collection, GuildBan, GuildBanManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings, replaceMentionCharacters } from "../utils";

export class GuildBans {
  declare cache: GuildBanManager["cache"];

  constructor() {
    Object.defineProperties(GuildBanManager.prototype, {
      searchBy: { value: this.searchBy },
      _searchByMany: { value: this._searchByMany },
      _searchByRegExp: { value: this._searchByRegExp },
      _searchByString: { value: this._searchByString },
    });
  }

  searchBy<T extends string>(query: T): GuildBan | undefined;
  searchBy<T extends RegExp>(query: T): GuildBan | undefined;
  searchBy<T extends Search>(query: T): GuildBan | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): GuildBan | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, GuildBan>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return typeof query.id === "string" && this.cache.get(query.id) ||
      this.cache.find(ban =>
        typeof query.displayName === "string" && compareStrings(query.displayName, ban.user.displayName) ||
        isRegExp(query.displayName) && query.displayName.test(ban.user.displayName) ||
        typeof query.username === "string" && compareStrings(query.username, ban.user.username) ||
        isRegExp(query.username) && query.username.test(ban.user.username) ||
        typeof ban.user.globalName === "string" && (
          typeof query.globalName === "string" && compareStrings(query.globalName, ban.user.globalName) ||
          isRegExp(query.globalName) && query.globalName.test(ban.user.globalName)
        ));
  }

  protected _searchByMany(queries: (string | RegExp | Search)[]) {
    const cache: this["cache"] = new Collection();
    for (const query of queries) {
      const result = this.searchBy(query);
      if (result) cache.set(result.user.id, result);
    }
    return cache;
  }

  protected _searchByRegExp(query: RegExp) {
    return this.cache.find((ban) =>
      query.test(ban.user.displayName) ||
      query.test(ban.user.username) ||
      (typeof ban.user.globalName === "string" && query.test(ban.user.globalName)));
  }

  protected _searchByString(query: string) {
    query = replaceMentionCharacters(query);
    return this.cache.get(query) ??
      this.cache.find((ban) => [
        ban.user.displayName?.toLowerCase(),
        ban.user.globalName?.toLowerCase(),
        ban.user.username?.toLowerCase(),
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string
  displayName?: string | RegExp
  globalName?: string | RegExp
  username?: string | RegExp
}
