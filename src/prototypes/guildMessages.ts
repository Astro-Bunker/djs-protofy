import { Collection, GuildMessageManager, type Message } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings } from "../utils";

export class GuildMessages {
  declare cache: GuildMessageManager["cache"];

  constructor() {
    Object.defineProperties(GuildMessageManager.prototype, {
      getById: { value: this.getById },
      filterByAuthorId: { value: this.filterByAuthorId },
      filterByContent: { value: this.filterByContent },
      filterByAuthorIsBots: { value: this.filterByAuthorIsBots },
    });
  }

  /** @DJSProtofy */
  getById(id: string) {
    return this.cache.get(id);
  }

  /** @DJSProtofy */
  filterByAuthorId(id: string) {
    if (typeof id !== "string") return new Collection<string, Message>();
    return this.cache.filter(cached => cached.author?.id === id);
  }

  /** @DJSProtofy */
  filterByContent(content: string | RegExp) {
    if (typeof content === "string") return this.cache.filter(cached => compareStrings(cached.content, content));

    if (isRegExp(content)) return this.cache.filter(cached => content.test(cached.content));

    return new Collection() as GuildMessageManager["cache"];
  }

  /** @DJSProtofy */
  filterByAuthorIsBots() {
    return this.cache.filter(cached => cached.author?.bot);
  }
}
