import { type EnumLike } from "discord.js";
import { DiscordStringLimits } from "../@enum";
import { exists, resolveEnum } from "../utils";

export class SString {
  declare length: string["length"];
  declare slice: string["slice"];

  constructor() {
    Object.defineProperties(String.prototype, {
      limit: { value: this.limit },
    });
  }

  /** @DJSProtofy */
  limit(length: number, enumLike?: EnumLike<any, any>) {
    if (!exists(enumLike)) enumLike = DiscordStringLimits;

    if (typeof length !== "number")
      length = resolveEnum(enumLike, length) ?? this.length;

    return this.slice(0, length);
  }
}
