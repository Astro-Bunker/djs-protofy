import { Client, Collection, GuildMessageManager, Message } from "discord.js";
import { isRegExp } from "util/types";

export class GuildMessages {
  declare cache: Collection<string, Message>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(GuildMessageManager.prototype, {
      getById: { value: this.getById },
      getByAuthors: { value: this.getByAuthors },
      getByContent: { value: this.getByContent },
      getByBots: { value: this.getByBots },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByAuthors(id: string | string[]) {
    if (typeof id !== "string" && !Array.isArray(id)) return new Collection<string, Message>();
    if (!Array.isArray(id)) id = [id];
    return this.cache.filter(message => id.includes(message.author?.id));
  }

  getByContent(content: string | RegExp) {
    if (typeof content !== "string" && !isRegExp(content)) return new Collection<string, Message>();

    return this.cache.filter(message => {
      if (typeof content === "string")
        return message.content === content;

      return content.test(message.content);
    });

  }

  getByBots() {
    return this.cache.filter(message => message.author?.bot);
  }
}
