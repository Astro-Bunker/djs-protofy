import { exists } from ".";

type SnakeCaseSeparator = "_";

export type Snakify<T, Shallow extends boolean = false> =
  T extends string
  ? StringSnakify<T>
  : T extends object
  ? ObjectSnakify<T, Shallow>
  : T;

type StringSnakify<S extends string> = FixStringSnakeCase<StringSnakifyFirstStep<S>>;

type StringSnakifyFirstStep<S extends string> =
  S extends `${infer A}${infer B}`
  ? `${A extends SnakeCaseSeparator ? "" : A extends Capitalize<A> ? SnakeCaseSeparator : ""}${Lowercase<A>}${StringSnakifyFirstStep<B>}`
  : S;

type FixStringSnakeCase<S extends string> =
  S extends `${infer A}${infer B}`
  ? `${A extends SnakeCaseSeparator ? "" : A}${B}`
  : S;

type ObjectSnakify<O, Shallow extends boolean = false> =
  O extends Array<infer U>
  ? Array<ObjectSnakify<U, Shallow>>
  : O extends object
  ? { [K in keyof O as StringSnakify<string & K>]: Shallow extends true ? O[K] : ObjectSnakify<O[K], Shallow> }
  : O;

export function snakify<U>(U: U): Snakify<U>;
export function snakify<U, Shallow extends boolean>(U: U, Shallow: Shallow): Snakify<U, Shallow>;
export function snakify<S extends string>(S: S): Snakify<S>;
export function snakify<O extends object>(O: O): Snakify<O>;
export function snakify<O extends object, Shallow extends boolean>(O: O, Shallow: Shallow): Snakify<O, Shallow>;
export function snakify(u: unknown, s = false) {
  if (!exists(u)) return u;

  if (typeof u === "string")
    return u.replace(/(^[A-Z])|([A-Z])/g, (_, a, b) => a ? a.toLowerCase() : `_${b.toLowerCase()}`);

  if (Array.isArray(u))
    return u.map(v => typeof v === "object" ? snakify(v, s) : v);

  return Object.entries(u)
    .reduce((a, [k, v]) => Object.assign(a, { [snakify(k)]: s ? v : typeof v === "object" ? snakify(v, s) : v }), {});
}
