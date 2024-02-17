import { APIGuild, Client, Collection, Guild, GuildManager } from "discord.js";
import { isRegExp } from "util/types";
import { serializeRegExp } from "../utils";

export class Guilds {
  declare cache: Collection<string, Guild>;
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
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(guild => {
      if (typeof name === "string") {
        return guild.name === name;
      }

      return name.test(guild.name);
    });
  }

  getByOwnerId(id: string): Collection<string, Guild> {
    if (typeof id !== "string") return new Collection();

    return this.cache.filter(guild => guild.ownerId === id);
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

    return await this.client.shard.broadcastEval((shard, id) => shard.guilds.getByOwnerId(id), { context: id })
      .then(res => res.flat())
      .catch(() => []);
  }
}
