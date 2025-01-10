import { Collection, GuildBanManager, type GuildBan } from "discord.js";
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

  /** @DJSProtofy */
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
      this.cache.find(cached =>
        typeof query.displayName === "string" && compareStrings(query.displayName, cached.user.displayName) ||
        isRegExp(query.displayName) && query.displayName.test(cached.user.displayName) ||
        typeof query.username === "string" && compareStrings(query.username, cached.user.username) ||
        isRegExp(query.username) && query.username.test(cached.user.username) ||
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
      if (result) cache.set(result.user.id, result);
    }
    return cache;
  }

  /** @DJSProtofy */
  protected _searchByRegExp(query: RegExp) {
    return this.cache.find((cached) =>
      query.test(cached.user.displayName) ||
      query.test(cached.user.username) ||
      (typeof cached.user.globalName === "string" && query.test(cached.user.globalName)));
  }

  /** @DJSProtofy */
  protected _searchByString(query: string) {
    query = replaceMentionCharacters(query).toLowerCase();
    return this.cache.get(query) ??
      this.cache.find((cached) => [
        cached.user.displayName.toLowerCase(),
        cached.user.globalName?.toLowerCase(),
        cached.user.username.toLowerCase(),
      ].includes(query));
  }
}

interface Search {
  id?: string
  displayName?: string | RegExp
  globalName?: string | RegExp
  username?: string | RegExp
}
