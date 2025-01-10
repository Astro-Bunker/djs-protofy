import { Collection, GuildMessageManager } from "discord.js";
import { isRegExp } from "util/types";

export class GuildMessages {
  declare cache: GuildMessageManager["cache"];

  constructor() {
    Object.defineProperties(GuildMessageManager.prototype, {
      getById: { value: this.getById },
      filterByAuthorId: { value: this.filterByAuthorId },
      filterByContent: { value: this.filterByContent },
      filterByAuthorIsBot: { value: this.filterByAuthorIsBot },
    });
  }

  /** @DJSProtofy */
  getById(id: string) {
    return this.cache.get(id);
  }

  /** @DJSProtofy */
  filterByAuthorId(authorId: string) {
    if (typeof authorId !== "string") return new Collection() as this["cache"];
    return this.cache.filter(cached => cached.author?.id === authorId);
  }

  /** @DJSProtofy */
  filterByContent(content: string | RegExp) {
    if (typeof content === "string") return this.cache.filter(cached => content.equals(cached.content, true));

    if (isRegExp(content)) return this.cache.filter(cached => content.test(cached.content));

    return new Collection() as this["cache"];
  }

  /** @DJSProtofy */
  filterByAuthorIsBot() {
    return this.cache.filter(cached => cached.author?.bot);
  }
}
