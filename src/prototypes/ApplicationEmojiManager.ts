import { type ApplicationEmoji, ApplicationEmojiManager, Collection } from "discord.js";
import { isRegExp } from "util/types";
import { replaceMentionCharacters } from "../utils";

export default class ApplicationEmojiManagerExtension {
  declare cache: ApplicationEmojiManager["cache"];

  constructor() {
    Object.defineProperties(ApplicationEmojiManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
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
    if (typeof name === "string") return this.cache.find(cached => typeof cached.name === "string" && name.equals(cached.name, true));

    if (isRegExp(name)) return this.cache.find(cached => typeof cached.name === "string" && name.test(cached.name));
  }

  /** @DJSProtofy */
  searchBy<T extends string>(query: T): ApplicationEmoji | undefined;
  searchBy<T extends RegExp>(query: T): ApplicationEmoji | undefined;
  searchBy<T extends Search>(query: T): ApplicationEmoji | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): ApplicationEmoji | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, ApplicationEmoji>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return typeof query.id === "string" && this.cache.get(query.id) ||
      (query.name) && this.cache.find(cached =>
        typeof cached.name === "string" && (
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
    return this.cache.find((cached) => typeof cached.name === "string" && query.test(cached.name));
  }

  /** @DJSProtofy */
  protected _searchByString(query: string) {
    query = query.toLowerCase();
    return this.cache.get(replaceMentionCharacters(query)) ??
      this.cache.find((cached) => [
        ...typeof cached.name === "string" ? [cached.name.toLowerCase()] : [],
      ].includes(query));
  }
}

interface Search {
  id?: string
  name?: string | RegExp
}
