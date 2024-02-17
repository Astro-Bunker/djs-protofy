import { BaseGuildEmojiManager, Client, Collection, GuildEmoji } from "discord.js";
import { isRegExp } from "util/types";

export class Emojis {
  declare cache: Collection<string, GuildEmoji>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(BaseGuildEmojiManager.prototype, {
      getById: { value: this.getById },
      getByAuthorId: { value: this.getByAuthorId },
      getByGuild: { value: this.getByGuild },
      getByName: { value: this.getByName },
      getAnimateds: { value: this.getAnimateds },
      getStatics: { value: this.getStatics },
      getAvailables: { value: this.getAvailables },
      getUnavailables: { value: this.getUnavailables },
      getDeletables: { value: this.getDeletables },
      getUndeletables: { value: this.getUndeletables },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByAuthorId(id: string) {
    if (typeof id !== "string") return new Collection();
    return this.cache.filter(emoji => emoji.author?.id === id);
  }

  getByGuild(id: string) {
    if (typeof id !== "string") return new Collection();
    return this.cache.filter(emoji => emoji.guild?.id === id);
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

  getAnimateds() {
    return this.cache.filter(emoji => emoji.animated);
  }

  getStatics() {
    return this.cache.filter(emoji => !emoji.animated);
  }

  getAvailables() {
    return this.cache.filter(emoji => emoji.available);
  }

  getUnavailables() {
    return this.cache.filter(emoji => !emoji.available);
  }

  getDeletables() {
    return this.cache.filter(emoji => emoji.deletable);
  }

  getUndeletables() {
    return this.cache.filter(emoji => !emoji.deletable);
  }
}
