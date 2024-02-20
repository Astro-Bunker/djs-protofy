import { APIChannel, Client, EnumLike, version } from "discord.js";
import { isRegExp } from "util/types";
import { suportedDJSVersion } from "./constants";
// @ts-expect-error ts(7016)
import { createChannel } from "discord.js/src/util/Channels";

export function verifyDJSVersion() {
  const v = Number(version.split(".")[0]);

  if (v !== suportedDJSVersion) {
    console.warn(`Expected discord.js@${suportedDJSVersion}. Some features may not work correctly.`);
  }
}

export function compareStrings(s1: string, s2: string, ignoreCase = true): boolean {
  if (typeof s1 !== "string" || typeof s2 !== "string") return false;

  if (ignoreCase) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  }

  return s1 === s2;
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

export function to_snake_case<T>(s: T): T;
export function to_snake_case<T extends string>(s: T): string;
export function to_snake_case<T extends Record<string, unknown>>(s: T): T;
export function to_snake_case(s: string | Record<string, unknown>) {
  if (typeof s === "string")
    return s.replace(/(^[A-Z])|([A-Z])/g, (_, a, b) => a ? a.toLowerCase() : `_${b.toLowerCase()}`);

  const newObject: Record<string, unknown> = {};

  for (const iterator of Object.keys(s)) {
    newObject[to_snake_case(iterator)] = s[iterator];
  }

  return newObject;
}

export function createBroadcastedChannel(client: Client<true>, data: APIChannel) {
  if ("availableTags" in data) delete data.availableTags;
  if ("guild" in data) delete data.guild;
  if ("member" in data) delete data.member;
  if ("messages" in data) delete data.messages;
  if ("permissionOverwrites" in data) delete data.permissionOverwrites;
  if ("recipients" in data) delete data.recipients;
  if ("threadMetadata" in data) delete data.threadMetadata;

  data = to_snake_case(data);

  try {
    return createChannel(client, data, null, { allowUnknownGuild: true });
  } catch { }
}
