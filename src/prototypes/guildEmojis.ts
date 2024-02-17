import { Client, Collection, GuildEmojiManager, GuildEmoji } from "discord.js";
import { isRegExp } from "util/types";

export class GuildEmojis {
  declare cache: Collection<string, GuildEmoji>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(GuildEmojiManager.prototype, {
      getById: { value: this.getById },
      getAllAnimated: { value: this.getAllAnimated },
      getAllStatic: { value: this.getAllStatic },
      getAllAvailable: { value: this.getAllAvailable },
      getAllUnavailable: { value: this.getAllUnavailable },
      getByAuthorId: { value: this.getByAuthorId },
      getByName: { value: this.getByName },
      getAllDeletable: { value: this.getAllDeletable },
      getAllUndeletable: { value: this.getAllUndeletable },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getAllAnimated() {
    return this.cache.filter(emoji => emoji.animated);
  }

  getAllStatic() {
    return this.cache.filter(emoji => !emoji.animated);
  }

  getAllAvailable() {
    return this.cache.filter(emoji => emoji.available);
  }

  getAllUnavailable() {
    return this.cache.filter(emoji => !emoji.available);
  }

  getAllDeletable() {
    return this.cache.filter(emoji => emoji.deletable);
  }

  getAllUndeletable() {
    return this.cache.filter(emoji => !emoji.deletable);
  }

  getByAuthorId(id: string): Collection<string, GuildEmoji> {
    if (typeof id !== "string") return new Collection();
    return this.cache.filter(emoji => emoji.author?.id === id);
  }

  getByName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(emoji => {
      if (typeof name === "string") {
        return emoji.name === name;
      }

      if (emoji.name)
        return name.test(emoji.name);
    });
  }
}
