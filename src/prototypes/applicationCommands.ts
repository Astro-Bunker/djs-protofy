import { ApplicationCommandManager, Client } from "discord.js";
import { isRegExp } from "util/types";

export class ApplicationCommands {
  declare cache: ApplicationCommandManager["cache"];
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(ApplicationCommandManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
    });
  }

  getById(id: string) {
    return this.cache.get(id);
  }

  getByName(name: string | RegExp) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(command => {
      if (command.name === null) return false;

      if (typeof name === "string") {
        return command.name === name;
      }

      return name.test(command.name);
    });
  }
}
