import { GuildManager } from "discord.js";

export class Guilds {
  declare cache: GuildManager["cache"];

  constructor() {
    Object.defineProperties(GuildManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
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
}
