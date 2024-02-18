import { BaseGuildEmojiManager, Client, Collection, GuildEmoji } from "discord.js";
import { isRegExp } from "util/types";

export class Emojis {
  declare cache: Collection<string, GuildEmoji>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(BaseGuildEmojiManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      filterByAuthorId: { value: this.filterByAuthorId },
      filterByGuildId: { value: this.filterByGuildId },
      filterAnimateds: { value: this.filterAnimateds },
      filterStatics: { value: this.filterStatics },
      filterAvailables: { value: this.filterAvailables },
      filterUnavailables: { value: this.filterUnavailables },
      filterDeletables: { value: this.filterDeletables },
      filterUndeletables: { value: this.filterUndeletables },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
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

  filterByAuthorId(id: string) {
    if (typeof id !== "string") return new Collection();
    return this.cache.filter(emoji => emoji.author?.id === id);
  }

  filterByGuildId(id: string) {
    if (typeof id !== "string") return new Collection();
    return this.cache.filter(emoji => emoji.guild?.id === id);
  }

  filterAnimateds() {
    return this.cache.filter(emoji => emoji.animated);
  }

  filterStatics() {
    return this.cache.filter(emoji => !emoji.animated);
  }

  filterAvailables() {
    return this.cache.filter(emoji => emoji.available);
  }

  filterUnavailables() {
    return this.cache.filter(emoji => !emoji.available);
  }

  filterDeletables() {
    return this.cache.filter(emoji => emoji.deletable);
  }

  filterUndeletables() {
    return this.cache.filter(emoji => !emoji.deletable);
  }
}
