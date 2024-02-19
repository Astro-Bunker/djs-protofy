import { APIGuild, Client, Collection, Guild, GuildManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings, serializeRegExp } from "../utils";

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

  async getInShardsById(id: string) {
    if (typeof id !== "string" || !this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, id) => shard.guilds.getById(id), { context: id })
      .then(res => res.find(Boolean) as APIGuild ?? null)
      .catch(() => null);
  }

  async getInShardsByName(name: string | RegExp) {
    if ((typeof name !== "string" && !isRegExp(name)) || !this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.guilds.getByName(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as APIGuild ?? null)
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

  searchBy(query: string | RegExp | Search) {
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
