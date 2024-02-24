import { Collection, GuildBan, GuildBanManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings } from "../utils";

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

    return this.cache.find(ban =>
      (
        query.id && (
          typeof query.id === "string" ?
            compareStrings(query.id, ban.user.id) :
            query.id.test(ban.user.id)
        )
      ) || (
        query.displayName && (
          typeof query.displayName === "string" ?
            compareStrings(query.displayName, ban.user.displayName) :
            query.displayName.test(ban.user.displayName)
        )
      ) || (
        query.globalName && ban.user.globalName && (
          typeof query.globalName === "string" ?
            compareStrings(query.globalName, ban.user.globalName) :
            query.globalName.test(ban.user.globalName)
        )
      ) || (
        query.username && (
          typeof query.username === "string" ?
            compareStrings(query.username, ban.user.username) :
            query.username.test(ban.user.username)
        )
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
      query.test(ban.user.id) ||
      query.test(ban.user.displayName) ||
      query.test(ban.user.username) ||
      (ban.user.globalName && query.test(ban.user.globalName)));
  }

  protected _searchByString(query: string) {
    return this.cache.get(query) ??
      this.cache.find((ban) => [
        ban.user.displayName?.toLowerCase(),
        ban.user.globalName?.toLowerCase(),
        ban.user.username?.toLowerCase(),
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string | RegExp
  displayName?: string | RegExp
  globalName?: string | RegExp
  username?: string | RegExp
}
