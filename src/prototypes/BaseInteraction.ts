import { BaseInteraction, type CacheType } from "discord.js";
import { InteractionTokenExpirationTime } from "../utils/constants";

export default class BaseInteractionExtension<Cached extends CacheType = CacheType> {
  declare createdTimestamp: BaseInteraction<Cached>["createdTimestamp"];

  constructor() {
    Object.defineProperties(BaseInteraction.prototype, {
      hasExpired: { get() { return this.createdTimestamp + InteractionTokenExpirationTime < Date.now(); } },
    });
  }

  /** @DJSProtofy */
  get hasExpired() {
    return this.createdTimestamp + InteractionTokenExpirationTime < Date.now();
  }
}
