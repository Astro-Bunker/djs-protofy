import { EnumLike, version } from "discord.js";
import { isRegExp } from "util/types";
import { suportedDJSVersion } from "./constants";

export function verifyDJSVersion() {
  const v = Number(version.split(".")[0]);

  if (v !== suportedDJSVersion) {
    process.emitWarning(`Expected discord.js@${suportedDJSVersion}. Some features may not work correctly.`);
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

export function excludeNullishProperties<O extends Record<any, any>>(O: O): void;
export function excludeNullishProperties(o: Record<any, any>) {
  for (const [key, value] of Object.entries(o)) {
    if (!exists(value)) delete o[key];
  }
}

export function exists<O>(O: O): O is NonNullable<O>;
export function exists(o: unknown) {
  return o !== undefined && o !== null;
}

/**
 * This replaces special characters mentioning user, channel or role leaving only the id in snowflate format.
 * 
 * https://discord.com/developers/docs/reference#message-formatting
 */
export function replaceMentionCharacters(s: string) {
  return s.replace(/<[@#][!&]?(\d{17,})>/, "$1");
}

export function resolveEnum<T extends EnumLike<keyof T, unknown>>(enumLike: T, value: keyof T | T[keyof T]): T[keyof T];
export function resolveEnum<T extends EnumLike<keyof T, T[keyof T]>>(enumLike: T, value: keyof T | T[keyof T]): T[keyof T];
export function resolveEnum(enumLike: EnumLike<any, any>, value: any) {
  if (isNaN(value)) return enumLike[value] ?? (Object.values(enumLike).includes(value) ? value : undefined);
  return value;
}

export function serializeRegExp(u: string | RegExp): { flags?: string, isRegExp: boolean, source: string };
export function serializeRegExp<R extends RegExp>(R: R): { flags: R["flags"], isRegExp: true, source: R["source"] };
export function serializeRegExp<S extends string>(S: S): { isRegExp: false, source: S };
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

export function to_snake_case<U>(U: U): U;
export function to_snake_case<S extends string>(S: S): string;
export function to_snake_case<R extends Record<string, unknown>>(R: R): R;
export function to_snake_case(u: unknown) {
  if (!exists(u)) return u;

  if (typeof u === "string")
    return u.replace(/(^[A-Z])|([A-Z])/g, (_, a, b) => a ? a.toLowerCase() : `_${b.toLowerCase()}`);

  if (Array.isArray(u))
    return u.map(v => typeof v === "object" ? to_snake_case(v) : v);

  return Object.entries(u)
    .map(([k, v]) => ({ [to_snake_case(k)]: typeof v === "object" ? to_snake_case(v) : v }));
}
