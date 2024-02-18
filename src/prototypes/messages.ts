import { Collection, Message, MessageManager } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings } from "../utils";

export class Messages {
  declare cache: MessageManager["cache"];

  constructor() {
    Object.defineProperties(MessageManager.prototype, {
      getById: { value: this.getById },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  filterByAuthorId(id: string) {
    if (typeof id !== "string") return new Collection<string, Message>();
    return this.cache.filter(message => message.author?.id === id);
  }

  filterByContent(content: string | RegExp) {
    if (typeof content !== "string" && !isRegExp(content)) return new Collection<string, Message>();

    return this.cache.filter(message => {
      if (typeof content === "string")
        return compareStrings(message.content, content);

      return content.test(message.content);
    });
  }

  filterByAuthorIsBots() {
    return this.cache.filter(message => message.author?.bot);
  }
}
