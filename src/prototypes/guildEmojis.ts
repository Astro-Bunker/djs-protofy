import { Client, Collection, GuildEmoji, GuildEmojiManager } from "discord.js";
import { isRegExp } from "util/types";

export class GuildEmojis {
  declare cache: Collection<string, GuildEmoji>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(GuildEmojiManager.prototype, {
      getById: { value: this.getById },
      getByAuthorId: { value: this.getByAuthorId },
      getByName: { value: this.getByName },
      getAnimated: { value: this.getAnimated },
      getStatic: { value: this.getStatic },
      getAvailable: { value: this.getAvailable },
      getUnavailable: { value: this.getUnavailable },
      getDeletable: { value: this.getDeletable },
      getUndeletable: { value: this.getUndeletable },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByAuthorId(id: string): Collection<string, GuildEmoji> {
    if (typeof id !== "string") return new Collection();
    return this.cache.filter(emoji => emoji.author?.id === id);
  }

  getByName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(emoji => {
      if (emoji.name === null) return false;

      if (typeof name === "string") {
        return emoji.name === name;
      }

      return name.test(emoji.name);
    });
  }

  getAnimated() {
    return this.cache.filter(emoji => emoji.animated);
  }

  getStatic() {
    return this.cache.filter(emoji => !emoji.animated);
  }

  getAvailable() {
    return this.cache.filter(emoji => emoji.available);
  }

  getUnavailable() {
    return this.cache.filter(emoji => !emoji.available);
  }

  getDeletable() {
    return this.cache.filter(emoji => emoji.deletable);
  }

  getUndeletable() {
    return this.cache.filter(emoji => !emoji.deletable);
  }
}
