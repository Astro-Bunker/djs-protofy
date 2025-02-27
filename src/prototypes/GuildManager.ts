import { Collection, GuildManager, type APIGuild, type Guild } from "discord.js";
import { isRegExp } from "util/types";
import { createBroadcastedGuild } from "../core/utils/shardUtils";
import { replaceMentionCharacters, serializeRegExp } from "../utils";
import { snakify } from "../utils/case";

export class GuildManagerExtension {
  declare cache: GuildManager["cache"];
  declare client: GuildManager["client"];

  constructor() {
    Object.defineProperties(GuildManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getInShardsById: { value: this.getInShardsById },
      getInShardsByName: { value: this.getInShardsByName },
      filterByOwnerId: { value: this.filterByOwnerId },
      filterInShardsByOwnerId: { value: this.filterInShardsByOwnerId },
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
  getInShardsById(id: string): Promise<Guild | null>;
  getInShardsById(id: string, allowApiGuild: true): Promise<APIGuild | Guild | null>;
  async getInShardsById(id: string, allowApiGuild?: boolean) {
    if (typeof id !== "string") return null;

    const existing = this.cache.get(id);
    if (existing) return existing;

    if (!this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, id) => shard.guilds.cache.get(id), { context: id })
      .then(res => res.find(Boolean) as any)
      .then(data => data ? createBroadcastedGuild(this.client, data)
        ?? (allowApiGuild ? snakify(data) : null) : null)
      .catch(console.error);
  }

  /** @DJSProtofy */
  getInShardsByName(name: string | RegExp): Promise<Guild | null>;
  getInShardsByName(name: string | RegExp, allowApiGuild: true): Promise<APIGuild | Guild | null>;
  async getInShardsByName(name: string | RegExp, allowApiGuild?: boolean) {
    if (typeof name !== "string" && !isRegExp(name)) return null;

    const existing = this.getByName(name);
    if (existing) return existing;

    if (!this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.guilds.getByName(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as any)
      .then(data => data ? createBroadcastedGuild(this.client, data)
        ?? (allowApiGuild ? snakify(data) : null) : null)
      .catch(() => null);
  }

  /** @DJSProtofy */
  filterByOwnerId(ownerId: string) {
    if (typeof ownerId !== "string") return new Collection<string, Guild>();

    return this.cache.filter(cached => cached.ownerId === ownerId);
  }

  /** @DJSProtofy */
  async filterInShardsByOwnerId(ownerId: string) {
    if (typeof ownerId !== "string" || !this.client.shard) return [];

    return await this.client.shard.broadcastEval((shard, id) => shard.guilds.filterByOwnerId(id), { context: ownerId })
      .then(res => res.flat())
      .catch(() => []);
  }

  /** @DJSProtofy */
  searchBy<T extends string>(query: T): Guild | undefined;
  searchBy<T extends RegExp>(query: T): Guild | undefined;
  searchBy<T extends Search>(query: T): Guild | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): Guild | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, Guild>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return typeof query.id === "string" && this.cache.get(query.id) ||
      this.cache.find(cached =>
        typeof query.name === "string" && cached.name.equals(query.name, true) ||
        isRegExp(query.name) && query.name.test(cached.name) ||
        typeof query.ownerId === "string" && cached.ownerId === query.ownerId);
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
    return this.cache.find((guild) => query.test(guild.name));
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
  ownerId?: string
}
