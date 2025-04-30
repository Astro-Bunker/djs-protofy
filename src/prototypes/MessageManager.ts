import { Collection, MessageManager, type Message } from "discord.js";
import { isRegExp } from "util/types";

export default class MessageManagerExtension<InGuild extends boolean = boolean> {
  declare cache: MessageManager<InGuild>["cache"];

  constructor() {
    Object.defineProperties(MessageManager.prototype, {
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
  filterByAuthorId(authorId: string): Collection<string, Message<InGuild>>;
  filterByAuthorId(authorId: string) {
    if (typeof authorId !== "string") return new Collection();
    return this.cache.filter(cached => cached.author?.id === authorId);
  }

  /** @DJSProtofy */
  filterByContent(content: string | RegExp): Collection<string, Message<InGuild>>;
  filterByContent(content: string | RegExp) {
    if (typeof content === "string") return this.cache.filter(cached => content.equals(cached.content, true));

    if (isRegExp(content)) return this.cache.filter(cached => content.test(cached.content));

    return new Collection();
  }

  /** @DJSProtofy */
  filterByAuthorIsBot() {
    return this.cache.filter(message => message.author?.bot);
  }
}
