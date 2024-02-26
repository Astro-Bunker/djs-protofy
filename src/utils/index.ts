import { Constructable, EnumLike, version } from "discord.js";
import { isRegExp } from "util/types";
import { suportedDJSVersion } from "./constants";

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

export function excludeNullishProperties<T extends Record<any, any>>(o: T): void;
export function excludeNullishProperties(o: Record<any, any>) {
  for (const [key, value] of Object.entries(o)) {
    if (!exists(value)) delete o[key];
  }
}

export function exists<O>(o: O): o is NonNullable<O> {
  return o !== undefined && o !== null;
}

export function isInstanceOf<O, T extends Constructable<O>>(o: O, t: T | T[]): o is InstanceType<T> {
  if (Array.isArray(t)) return t.every(t => o instanceof t);
  return o instanceof t;
}

/**
 * This replaces special characters mentioning user, channel or role leaving only the id in snowflate format.
 * 
 * https://discord.com/developers/docs/reference#message-formatting
 */
export function replaceMentionCharacters(s: string) {
  return s.replace(/<[@#][!&]?(\d{17,})>/, "$1");
}

export function resolveEnum<T extends EnumLike<any, any>>(enumLike: T, value: keyof T | T[keyof T]): T[keyof T];
export function resolveEnum(enumLike: EnumLike<any, any>, value: unknown) {
  if (typeof value === "string") return enumLike[value];
  return value;
}

export function serializeRegExp<R extends RegExp>(r: R): { flags: R["flags"], isRegExp: true, source: R["source"] };
export function serializeRegExp<S extends string>(s: S): { isRegExp: false, source: S };
export function serializeRegExp(u: string | RegExp): { flags?: string, isRegExp: boolean, source: string };
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
