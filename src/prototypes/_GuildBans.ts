import { Collection, GuildBanManager, type GuildBan } from "discord.js";
import { isRegExp } from "util/types";
import { replaceMentionCharacters } from "../utils";

export class GuildBanManagerExtension {
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
        typeof query.displayName === "string" && cached.user.displayName.equals(query.displayName, true) ||
        isRegExp(query.displayName) && query.displayName.test(cached.user.displayName) ||
        typeof query.username === "string" && cached.user.username.equals(cached.user.username, true) ||
        isRegExp(query.username) && query.username.test(cached.user.username) ||
        typeof cached.user.globalName === "string" && (
          typeof query.globalName === "string" && cached.user.globalName.equals(query.globalName, true) ||
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
    query = query.toLowerCase();
    return this.cache.get(replaceMentionCharacters(query)) ??
      this.cache.find((cached) => [
        cached.user.displayName.toLowerCase(),
        ...cached.user.globalName ? [cached.user.globalName.toLowerCase()] : [],
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
