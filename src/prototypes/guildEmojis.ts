import { Collection, GuildEmoji, GuildEmojiManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings, replaceMentionCharacters } from "../utils";

export class GuildEmojis {
  declare cache: GuildEmojiManager["cache"];

  constructor() {
    Object.defineProperties(GuildEmojiManager.prototype, {
      getById: { value: this.getById },
      filterByAuthorId: { value: this.filterByAuthorId },
      getByName: { value: this.getByName },
      filterAnimateds: { value: this.filterAnimateds },
      filterStatics: { value: this.filterStatics },
      filterAvailables: { value: this.filterAvailables },
      filterUnavailables: { value: this.filterUnavailables },
      filterDeletables: { value: this.filterDeletables },
      filterUndeletables: { value: this.filterUndeletables },
      searchBy: { value: this.searchBy },
      _searchByMany: { value: this._searchByMany },
      _searchByRegExp: { value: this._searchByRegExp },
      _searchByString: { value: this._searchByString },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(emoji => {
      if (emoji.name === null) return false;

      if (typeof name === "string") {
        return compareStrings(emoji.name, name);
      }

      return name.test(emoji.name);
    });
  }

  filterByAuthorId(id: string) {
    if (typeof id !== "string") return new Collection<string, GuildEmoji>();
    return this.cache.filter(emoji => emoji.author?.id === id);
  }

  filterAnimateds() {
    return this.cache.filter(emoji => emoji.animated);
  }

  filterStatics() {
    return this.cache.filter(emoji => !emoji.animated);
  }

  filterAvailables() {
    return this.cache.filter(emoji => emoji.available);
  }

  filterUnavailables() {
    return this.cache.filter(emoji => !emoji.available);
  }

  filterDeletables() {
    return this.cache.filter(emoji => emoji.deletable);
  }

  filterUndeletables() {
    return this.cache.filter(emoji => !emoji.deletable);
  }

  searchBy<T extends string>(query: T): GuildEmoji | undefined;
  searchBy<T extends RegExp>(query: T): GuildEmoji | undefined;
  searchBy<T extends Search>(query: T): GuildEmoji | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): GuildEmoji | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, GuildEmoji>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return this.cache.find(emoji =>
      (
        query.id && (
          typeof query.id === "string" ?
            compareStrings(query.id, emoji.id) :
            query.id.test(emoji.id)
        )
      ) || (
        query.name && emoji.name && (
          typeof query.name === "string" ?
            compareStrings(query.name, emoji.name) :
            query.name.test(emoji.name)
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
    return this.cache.find((emoji) =>
      query.test(emoji.id) ||
      (emoji.name && query.test(emoji.name)));
  }

  protected _searchByString(query: string) {
    query = replaceMentionCharacters(query);
    return this.cache.get(query) ??
      this.cache.find((emoji) => [
        emoji.name?.toLowerCase(),
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string | RegExp
  name?: string | RegExp
}
