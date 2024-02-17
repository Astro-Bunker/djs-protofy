import { EnumLike, version } from "discord.js";
import { suportedDJSVersion } from "./constants";

export function verifyDJSVersion() {
  const v = Number(version.split(".")[0]);

  if (v !== suportedDJSVersion) {
    console.warn(`Expected discord.js@${suportedDJSVersion}. Some features may not work correctly.`)
  }
}

export function resolveEnum<T extends EnumLike<any, unknown>>(enumLike: T, value: keyof T | T[keyof T]): T[keyof T] {
  if (typeof value === "string") return enumLike[value];
  return value as T[keyof T];
}
