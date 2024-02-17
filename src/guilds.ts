import { APIGuild, Client, Collection, Guild, GuildManager } from "discord.js";

export class Guilds {
  declare cache: GuildManager["cache"];
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(GuildManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getByOwnerId: { value: this.getByOwnerId },
      getInShardsById: { value: this.getInShardsById },
      getInShardsByName: { value: this.getInShardsByName },
      getInShardsByOwnerId: { value: this.getInShardsByOwnerId },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByName(name: string | RegExp) {
    if (!name) return;

    return this.cache.find(guild => {
      if (typeof name === "string") {
        return guild.name === name;
      }

      return name.test(guild.name);
    });
  }

  getByOwnerId(id: string | RegExp): Collection<string, Guild> | undefined {
    if (!id) return;

    return this.cache.filter(guild => {
      if (typeof id === "string") {
        return guild.ownerId === id;
      }

      return id.test(guild.ownerId);
    });
  }

  async getInShardsById(id: string) {
    if (!id || !this.client.shard) return null;

    if (this.client.shard) {
      return await this.client.shard.broadcastEval((shard, id) => shard.guilds.getById(id), { context: id })
        .then(res => res.find(Boolean) as APIGuild)
        .catch(() => null);
    }

    return this.getById(id);
  }

  async getInShardsByName(name: string) {
    if (!name || !this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, name) => shard.guilds.getByName(name), { context: name })
      .then(res => res.find(Boolean) as APIGuild)
      .catch(() => null);

  }

  async getInShardsByOwnerId(id: string) {
    if (!id || !this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, id) => shard.guilds.getByOwnerId(id), { context: id })
      .then(res => res.filter(Boolean))
      .catch(() => null);

  }
}
