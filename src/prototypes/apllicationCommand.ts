import { ApplicationCommand } from "discord.js";

export class AppCommand {
  declare id: ApplicationCommand["id"];
  declare name: ApplicationCommand["name"];

  constructor() {
    Object.defineProperties(ApplicationCommand.prototype, {
      mention: {
        get() {
          return this.toString();
        },
      },
      toString: { value: this.toString },
    });
  }

  toString() {
    return `</${this.name}:${this.id}>`;
  }
}
