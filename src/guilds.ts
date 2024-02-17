import { APIGuild, Client, Collection, Guild, GuildManager } from "discord.js";

export class Guilds {
  declare cache: GuildManager["cache"];
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(GuildManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getInShardsById: { value: this.getInShardsById },
      getByOwnerId: { value: this.getByOwnerId },
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
    if (!id) return null;

    if (this.client.shard) {
      return await this.client.shard.broadcastEval((shard, id) => shard.guilds.getById(id), { context: id })
        .then(res => res.find(Boolean) as APIGuild)
        // @ts-expect-error ts(2673)
        .then(res => res ? new Guild(this.client, res) : null)
        .catch(() => null);
    }

    return this.getById(id);
  }
}
