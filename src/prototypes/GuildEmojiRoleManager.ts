import { Collection, GuildEmojiRoleManager, type Role } from "discord.js";
import { isRegExp } from "util/types";
import { replaceMentionCharacters } from "../utils";

export default class GuildEmojiRoleManagerExtension {
  declare cache: GuildEmojiRoleManager["cache"];

  constructor() {
    Object.defineProperties(GuildEmojiRoleManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getByPosition: { value: this.getByPosition },
      getByRawPosition: { value: this.getByRawPosition },
      getByUnicodeEmoji: { value: this.getByUnicodeEmoji },
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
  getByName(name: string | RegExp) {
    if (typeof name === "string") return this.cache.find(cached => name.equals(cached.name, true));

    if (isRegExp(name)) return this.cache.find(cached => name.test(cached.name));
  }

  /** @DJSProtofy */
  getByPosition(position: number) {
    return this.cache.find(role => role.position === position);
  }

  /** @DJSProtofy */
  getByRawPosition(position: number) {
    return this.cache.find(role => role.rawPosition === position);
  }

  /** @DJSProtofy */
  getByUnicodeEmoji(emoji: string) {
    return this.cache.find(role => role.unicodeEmoji === emoji);
  }

  /** @DJSProtofy */
  searchBy<T extends string>(query: T): Role | undefined;
  searchBy<T extends RegExp>(query: T): Role | undefined;
  searchBy<T extends Search>(query: T): Role | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): Role | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, Role>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return typeof query.id === "string" && this.cache.get(query.id) ||
      this.cache.find(cached => (
        typeof query.name === "string" && cached.name.equals(query.name, true) ||
        isRegExp(query.name) && query.name.test(cached.name)
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
    return this.cache.find((cached) => query.test(cached.name));
  }

  /** @DJSProtofy */
  protected _searchByString(query: string) {
    query = query.toLowerCase();
    return this.cache.get(replaceMentionCharacters(query)) ??
      this.cache.find((cached) => [
        cached.name.toLowerCase(),
      ].includes(query));
  }
}

interface Search {
  id?: string
  name?: string | RegExp
}
