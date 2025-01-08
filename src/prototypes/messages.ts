import { Collection, MessageManager, type Message } from "discord.js";
import { isRegExp } from "util/types";
import { compareStrings } from "../utils";

export class Messages {
  declare cache: MessageManager["cache"];

  constructor() {
    Object.defineProperties(MessageManager.prototype, {
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
    if (typeof content === "string") return this.cache.filter(cached => compareStrings(cached.content, content));

    if (isRegExp(content)) return this.cache.filter(cached => content.test(cached.content));

    return new Collection() as MessageManager["cache"];
  }

  /** @DJSProtofy */
  filterByAuthorIsBots() {
    return this.cache.filter(message => message.author?.bot);
  }
}
