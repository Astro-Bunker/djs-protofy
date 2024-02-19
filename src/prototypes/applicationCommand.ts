import { ApplicationCommand } from "discord.js";

export class SApplicationCommand {
  declare id: string;
  declare name: string;
  declare mention: string;

  constructor() {
    Object.defineProperties(ApplicationCommand.prototype, {
      getMention: { value: this.getMention },
      mention: { get() { return `</${this.name}:${this.id}>`; } },
      toString: { value: this.toString },
    });
  }

  getMention(): `</${string}:${string}>`;
  getMention<S extends string>(subCommand: S): `</${string} ${S}:${string}>`;
  getMention<G extends string, S extends string>(subGroup: G, subCommand: S): `</${string} ${G} ${S}:${string}>`;
  getMention(subGroup?: string, subCommand?: string) {
    if (subCommand)
      return `</${this.name} ${subGroup} ${subCommand}:${this.id}>`;

    if (subGroup)
      return `</${this.name} ${subGroup}:${this.id}>`;

    return this.mention;
  }

  toString() {
    return this.mention;
  }
}
