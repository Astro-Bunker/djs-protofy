import { APIGuild, Client, Collection, Guild, GuildManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings, createBroadcastedGuild, serializeRegExp, to_snake_case } from "../utils";

export class Guilds {
  declare cache: GuildManager["cache"];
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(GuildManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getInShardsById: { value: this.getInShardsById },
      getInShardsByName: { value: this.getInShardsByName },
      getInShardsByOwnerId: { value: this.getInShardsByOwnerId },
      filterByOwnerId: { value: this.filterByOwnerId },
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

    return this.cache.find(guild => {
      if (typeof name === "string") {
        return compareStrings(guild.name, name);
      }

      return name.test(guild.name);
    });
  }

  async getInShardsById(id: string): Promise<Guild | null>;
  async getInShardsById(id: string, allowApiGuild: true): Promise<APIGuild | Guild | null>;
  async getInShardsById(id: string, allowApiGuild?: boolean) {
    if (typeof id !== "string") return null;

    const guild = this.getById(id);
    if (guild) return guild;

    if (!this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, id) => shard.guilds.getById(id), { context: id })
      .then(res => res.find(Boolean) as any)
      .then(data => data ? createBroadcastedGuild(this.client, data)
        ?? (allowApiGuild ? to_snake_case(data) : null) : null)
      .catch(console.error);
  }

  async getInShardsByName(id: string): Promise<Guild | null>;
  async getInShardsByName(id: string, allowApiGuild: true): Promise<APIGuild | Guild | null>;
  async getInShardsByName(name: string | RegExp, allowApiGuild?: boolean) {
    if (typeof name !== "string" && !isRegExp(name)) return null;

    const guild = this.getByName(name);
    if (guild) return guild;

    if (!this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.guilds.getByName(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as any)
      .then(data => data ? createBroadcastedGuild(this.client, data)
        ?? (allowApiGuild ? to_snake_case(data) : null) : null)
      .catch(() => null);
  }

  async getInShardsByOwnerId(id: string) {
    if (typeof id !== "string" || !this.client.shard) return [];

    return await this.client.shard.broadcastEval((shard, id) => shard.guilds.filterByOwnerId(id), { context: id })
      .then(res => res.flat())
      .catch(() => []);
  }

  filterByOwnerId(id: string) {
    if (typeof id !== "string") return new Collection<string, Guild>();

    return this.cache.filter(guild => guild.ownerId === id);
  }

  searchBy<T extends string | RegExp>(query: T): Guild | undefined;
  searchBy<T extends Search>(query: T): Guild | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): Guild | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, Guild>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return this.cache.find(guild =>
      (
        query.id && (
          typeof query.id === "string" ?
            compareStrings(query.id, guild.id) :
            query.id.test(guild.id)
        )
      ) || (
        query.name && (
          typeof query.name === "string" ?
            compareStrings(query.name, guild.name) :
            query.name.test(guild.name)
        )
      ) || (
        query.ownerId && (
          typeof query.ownerId === "string" ?
            compareStrings(query.ownerId, guild.ownerId) :
            query.ownerId.test(guild.ownerId)
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
    return this.cache.find((guild) =>
      query.test(guild.id) ||
      query.test(guild.name));
  }

  protected _searchByString(query: string) {
    return this.cache.get(query) ??
      this.cache.find((guild) => [
        guild.name.toLowerCase(),
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string | RegExp
  name?: string | RegExp
  ownerId?: string | RegExp
}
