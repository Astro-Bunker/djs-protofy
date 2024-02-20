import { APIChannel, APIGuild, Channel, Client, EnumLike, Guild, version } from "discord.js";
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

export function exists<O>(o: O): o is NonNullable<O> {
  return o !== undefined && o !== null;
}

export function resolveEnum<T extends EnumLike<any, any>>(enumLike: T, value: keyof T | T[keyof T]): T[keyof T];
export function resolveEnum(enumLike: EnumLike<any, any>, value: unknown) {
  if (typeof value === "string") return enumLike[value];
  return value;
}

export function serializeRegExp(u: string | RegExp): { flags?: string, isRegExp: boolean, source: string };
export function serializeRegExp<R extends RegExp>(r: R): { flags: string, isRegExp: true, source: string };
export function serializeRegExp<S extends string>(s: S): { isRegExp: false, source: S };
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

export function to_snake_case<U>(u: U): U;
export function to_snake_case<S extends string>(s: S): string;
export function to_snake_case<R extends Record<string, unknown>>(R: R): R;
export function to_snake_case(u: string | Record<string, unknown>) {
  if (typeof u === "string")
    return u.replace(/(^[A-Z])|([A-Z])/g, (_, a, b) => a ? a.toLowerCase() : `_${b.toLowerCase()}`);

  const newObject: Record<string, unknown> = {};

  for (const iterator of Object.keys(u)) {
    newObject[to_snake_case(iterator)] = u[iterator];
  }

  return newObject;
}

export function createBroadcastedChannel(client: Client<true>, data: Channel | APIChannel): Channel | undefined;
export function createBroadcastedChannel(client: Client<true>, data: Record<string, any>): Channel | undefined {
  if ("messages" in data) delete data.messages;
  if ("permissionOverwrites" in data) delete data.permissionOverwrites;
  if ("recipients" in data) delete data.recipients;
  // if ("threadMetadata" in data) delete data.threadMetadata;

  data = to_snake_case(data);

  // const clone = Object.assign(Object.create(data), data);
  const guild = client.guilds.getById(data.guild_id);

  if ("guild" in data && typeof data.guild === "string") {
    if (guild) {
      data.guild = guild;
    } else {
      delete data.guild;
    }
  }

  if ("member" in data && typeof data.member === "string") {
    if (guild) {
      data.member = guild.members.getById(data.member);
    } else {
      delete data.member;
    }
  }

  try {
    return createChannel(client, data, guild, { allowUnknownGuild: true });
  } catch (error: any) {
    client.emit("error", error);
  }
}

export function createBroadcastedGuild(client: Client<true>, data: Guild | APIGuild): Guild | undefined;
export function createBroadcastedGuild(client: Client<true>, data: Record<string, any>): Guild | undefined {
  data = to_snake_case(data);

  const clone = Object.assign(Object.create(data), data);
  const guild = client.guilds.getById(data.id);

  if ("emojis" in data && Array.isArray(data.emojis)) {
    data.emojis = [];
    for (const id of clone.emojis) {
      const result = client.emojis.getById(id);
      if (result) data.emojis.push(result);
    }
  }

  if ("members" in data && Array.isArray(data.members)) {
    if (guild) {
      data.members = [];
      for (const id of clone.members) {
        const result = guild.members.getById(id);
        if (result) data.members.push(result);
      }
    } else {
      delete data.members;
    }
  }

  if ("roles" in data && Array.isArray(data.roles)) {
    if (guild) {
      data.roles = [];
      for (const id of clone.roles) {
        const result = guild.roles.getById(id);
        if (result) data.roles.push(result);
      }
    } else {
      delete data.roles;
    }
  }

  try {
    // @ts-expect-error ts(2673)
    return new Guild(client, data);
  } catch (error: any) {
    client.emit("error", error);
  }
}
