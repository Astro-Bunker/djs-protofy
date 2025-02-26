import { type EnumLike } from "discord.js";
import { isRegExp } from "util/types";

export function compareStrings<C extends true>(s1: string, s2: string, ignoreCase?: C): boolean
export function compareStrings<C extends boolean>(s1: string, s2: string, ignoreCase: C): boolean
export function compareStrings(s1: string, s2: string, ignoreCase = true): boolean {
  if (typeof s1 !== "string" || typeof s2 !== "string") return false;

  if (ignoreCase) return s1.localeCompare(s2, undefined, { sensitivity: "accent" }) === 0;

  return s1 === s2;
}

export function excludeNullishProperties<O extends Record<any, any>>(O: O): void;
export function excludeNullishProperties(o: Record<any, any>) {
  if (typeof o !== "object" || o === null) return;

  for (const key in o) {
    if (!exists(o[key])) delete o[key];
  }
}

export function exists<O>(O: O): O is NonNullable<O>;
export function exists(o: unknown) {
  return o !== undefined && o !== null;
}

/**
 * This replaces special characters mentioning
 * `channel`, `command`, `emoji`, `member`, `role` or `user`
 * leaving only the id in snowflate format.
 * 
 * https://discord.com/developers/docs/reference#message-formatting
 */
export function replaceMentionCharacters(s: string) {
  return s.replace(/<(?:(?:a?:|\/)\w{1,32}:|[@#][!&]?)(\d{17,})>/g, "$1");
}

export function resolveEnum<T extends EnumLike<keyof T, T[keyof T]>>(enumLike: T, value: keyof T | T[keyof T]): T[keyof T];
export function resolveEnum<T extends EnumLike<keyof T, unknown>>(enumLike: T, value: keyof T | T[keyof T]): T[keyof T];
export function resolveEnum(enumLike: EnumLike<any, any>, value: any) {
  if (isNaN(value)) return enumLike[value] ?? (Object.values(enumLike).includes(value) ? value : undefined);
  return value;
}

export function serializeRegExp<R extends RegExp>(R: R): { flags: R["flags"], isRegExp: true, source: R["source"] };
export function serializeRegExp<S extends string>(S: S): { isRegExp: false, source: S };
export function serializeRegExp<T extends string | RegExp>(T: T): { flags?: string, isRegExp: boolean, source: string };
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
