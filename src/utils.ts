import { EnumLike, version } from "discord.js";
import { isRegExp } from "util/types";
import { suportedDJSVersion } from "./constants";

export function verifyDJSVersion() {
  const v = Number(version.split(".")[0]);

  if (v !== suportedDJSVersion) {
    console.warn(`Expected discord.js@${suportedDJSVersion}. Some features may not work correctly.`);
  }
}

export function compareStrings(s1: string, s2: string, ignoreCase = true): boolean {
  if (ignoreCase) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  }

  return s1.includes(s2);
}

export function resolveEnum<T extends EnumLike<any, unknown>>(enumLike: T, value: keyof T | T[keyof T]): T[keyof T] {
  if (typeof value === "string") return enumLike[value];
  return value as T[keyof T];
}

export function serializeRegExp(value: string | RegExp) {
  if (isRegExp(value)) {
    return {
      flags: value.flags,
      source: value.source,
      isRegExp: true,
    };
  }

  return {
    source: value,
    isRegExp: false,
  };
}
