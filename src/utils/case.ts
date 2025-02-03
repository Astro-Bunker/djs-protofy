import { exists } from ".";

export type Snakify<T, S extends boolean = false> =
  T extends string
  ? StringSnakify<T>
  : T extends object
  ? ObjectSnakify<T, S>
  : T;

type StringSnakify<S extends string> = FixStringSnakeCase<StringSnakifyFirstStep<S>>;

type StringSnakifyFirstStep<S extends string> =
  S extends `${infer A}${infer B}`
  ? `${A extends Capitalize<A> ? "_" : ""}${Lowercase<A>}${StringSnakifyFirstStep<B>}`
  : S;

type FixStringSnakeCase<S extends string> =
  S extends `${infer A}${infer B}`
  ? `${A extends "_" ? "" : A}${B}`
  : S;

type ObjectSnakify<O, S extends boolean = false> =
  O extends Array<infer U>
  ? Array<ObjectSnakify<U, S>>
  : O extends object
  ? { [K in keyof O as StringSnakify<string & K>]: S extends true ? O[K] : ObjectSnakify<O[K], S> }
  : O;

export function to_snake_case<U>(U: U): Snakify<U>;
export function to_snake_case<U, Shallow extends boolean>(U: U, S: Shallow): Snakify<U, Shallow>;
export function to_snake_case<S extends string>(S: S): Snakify<S>;
export function to_snake_case<R extends Record<string, unknown>>(R: R): Snakify<R>;
export function to_snake_case<R extends Record<string, unknown>, Shallow extends boolean>(R: R, S: Shallow): Snakify<R, Shallow>;
export function to_snake_case(u: unknown, s = false) {
  if (!exists(u)) return u;

  if (typeof u === "string")
    return u.replace(/(^[A-Z])|([A-Z])/g, (_, a, b) => a ? a.toLowerCase() : `_${b.toLowerCase()}`);

  if (Array.isArray(u))
    return u.map(v => typeof v === "object" ? to_snake_case(v, s) : v);

  return Object.entries(u)
    .reduce((a, [k, v]) => Object.assign(a, { [to_snake_case(k)]: s ? v : typeof v === "object" ? to_snake_case(v, s) : v }), {});
}
