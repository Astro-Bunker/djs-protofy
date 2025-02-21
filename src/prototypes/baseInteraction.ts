import { BaseInteraction, type CacheType } from "discord.js";

export class SBaseInteraction<Cached extends CacheType = CacheType> {
  declare createdTimestamp: BaseInteraction<Cached>["createdTimestamp"];

  constructor() {
    Object.defineProperties(BaseInteraction.prototype, {
      hasExpired: { get() { return this.createdTimestamp + 900_000 < Date.now(); } },
    });
  }

  /** @DJSProtofy */
  get hasExpired() {
    return this.createdTimestamp + 900_000 < Date.now();
  }
}
