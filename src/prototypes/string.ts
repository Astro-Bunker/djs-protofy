import { type EnumLike } from "discord.js";
import { DiscordStringLimits } from "../@enum";
import { exists, resolveEnum } from "../utils";

export class SString {
  declare length: string["length"];
  declare slice: string["slice"];
  declare localeCompare: string["localeCompare"];

  constructor() {
    Object.defineProperties(String.prototype, {
      equals: { value: this.equals },
      limit: { value: this.limit },
    });
  }

  equals(other: string, ignoreCase?: boolean) {
    if (typeof other !== "string") return false;

    if (ignoreCase) return this.localeCompare(other, undefined, { sensitivity: "accent" }) === 0;

    return (this as unknown) === other;
  }

  /** @DJSProtofy */
  limit(length: number, enumLike?: EnumLike<any, any>) {
    if (!exists(enumLike)) enumLike = DiscordStringLimits;

    if (typeof length !== "number")
      length = resolveEnum(enumLike, length) ?? this.length;

    return this.slice(0, length);
  }
}
