import { APIGuild, Client, Collection, Guild, GuildManager } from "discord.js";

export class Guilds {
  declare cache: Collection<string, Guild>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(GuildManager.prototype, {
      find: { value: this.find },
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getByOwnerId: { value: this.getByOwnerId },
      getInShardsById: { value: this.getInShardsById },
      getInShardsByName: { value: this.getInShardsByName },
      getInShardsByOwnerId: { value: this.getInShardsByOwnerId },
    });
  }

  get find() {
    return this.cache.find;
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByName(name: string | RegExp) {
    if (!name) return;

    return this.find(guild => {
      if (typeof name === "string") {
        return guild.name === name;
      }

      return name.test(guild.name);
    });
  }

  getByOwnerId(id: string): Collection<string, Guild> {
    if (!id) return new Collection();

    return this.cache.filter(guild => guild.ownerId === id);
  }

  async getInShardsById(id: string) {
    if (!id || !this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, id) => shard.guilds.getById(id), { context: id })
      .then(res => res.find(Boolean) as APIGuild ?? null)
      .catch(() => null);
  }

  async getInShardsByName(name: string) {
    if (!name || !this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, name) => shard.guilds.getByName(name), { context: name })
      .then(res => res.find(Boolean) as APIGuild ?? null)
      .catch(() => null);

  }

  async getInShardsByOwnerId(id: string) {
    if (!id || !this.client.shard) return [];

    return await this.client.shard.broadcastEval((shard, id) => shard.guilds.getByOwnerId(id), { context: id })
      .then(res => res.flat())
      .catch(() => []);
  }
}
