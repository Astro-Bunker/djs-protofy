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
    return this.cache.filter(message => message.author?.id === id);
  }

  /** @DJSProtofy */
  filterByContent(content: string | RegExp) {
    if (typeof content !== "string" && !isRegExp(content)) return new Collection<string, Message>();

    return this.cache.filter(message => {
      if (typeof content === "string")
        return compareStrings(message.content, content);

      return content.test(message.content);
    });
  }

  /** @DJSProtofy */
  filterByAuthorIsBots() {
    return this.cache.filter(message => message.author?.bot);
  }
}
