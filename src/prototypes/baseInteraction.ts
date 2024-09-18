import { BaseInteraction, Constants } from "discord.js";

export class SBaseInteraction {
  declare createdTimestamp: BaseInteraction["createdTimestamp"];

  constructor() {
    Object.defineProperties(BaseInteraction.prototype, {
      hasExpired: { get() { return (this.createdTimestamp + 900_000) >= Date.now(); } }
    });
  }

  get hasExpired() {
    return (this.createdTimestamp + 900_000) >= Date.now();
  }
}
