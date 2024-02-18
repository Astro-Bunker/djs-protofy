import { Collection, Message, MessageManager } from "discord.js";

export class Messages {
  declare cache: Collection<string, Message>;

  constructor() {
    Object.defineProperties(MessageManager.prototype, {
      getById: { value: this.getById },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }
}
