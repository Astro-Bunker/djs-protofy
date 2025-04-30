export type Camelify<T, Sep extends string = typeof defaultCaseSeparator, Shallow extends boolean = false> =
  T extends string
  ? StringCamelify<T, Sep>
  : T extends object
  ? ObjectCamelify<T, Sep, Shallow>
  : T

type StringCamelify<S, Sep extends string> = S extends `${infer P1}${Sep}${infer P2}${infer P3}`
  ? `${P1}${Uppercase<P2>}${StringCamelify<P3, Sep>}`
  : S;

type ObjectCamelify<O, Sep extends string, Shallow extends boolean = false> =
  O extends Array<infer U>
  ? Array<ObjectCamelify<U, Sep, Shallow>>
  : O extends object
  ? { [K in keyof O as StringCamelify<string & K, Sep>]: Shallow extends true ? O[K] : ObjectCamelify<O[K], Sep, Shallow> }
  : O;

export type Snakify<T, Sep extends string = typeof defaultCaseSeparator, Shallow extends boolean = false> =
  T extends string
  ? StringSnakify<T, Sep>
  : T extends object
  ? ObjectSnakify<T, Sep, Shallow>
  : T;

type StringSnakify<S extends string, Sep extends string> = FixStringSnakeCase<StringSnakifyFirstStep<S, Sep>, Sep>;

type StringSnakifyFirstStep<S extends string, Sep extends string> =
  S extends `${infer A}${infer B}`
  ? `${A extends Sep ? "" : A extends Capitalize<A> ? Sep : ""}${Lowercase<A>}${StringSnakifyFirstStep<B, Sep>}`
  : S;

type FixStringSnakeCase<S extends string, Sep extends string> =
  S extends `${infer A}${infer B}`
  ? `${A extends Sep ? "" : A}${B}`
  : S;

type ObjectSnakify<O, Sep extends string, Shallow extends boolean = false> =
  O extends Array<infer U>
  ? Array<ObjectSnakify<U, Sep, Shallow>>
  : O extends object
  ? { [K in keyof O as StringSnakify<string & K, Sep>]: Shallow extends true ? O[K] : ObjectSnakify<O[K], Sep, Shallow> }
  : O;

const defaultCaseSeparator = "_" as const;

export function camelify<U, Sep extends string>(U: U, Sep?: Sep): Camelify<U, Sep>;
export function camelify<U, Sep extends string, Shallow extends boolean>(U: U, Shallow: Shallow, Sep?: Sep): Camelify<U, Sep, Shallow>;
export function camelify<S extends string, Sep extends string>(S: S, Sep?: Sep): Camelify<S, Sep>;
export function camelify<O extends object, Sep extends string>(O: O, Sep?: Sep): Camelify<O, Sep>;
export function camelify<O extends object, Sep extends string, Shallow extends boolean>(O: O, Shallow: Shallow, Sep?: Sep): Camelify<O, Sep, Shallow>;
export function camelify(u: unknown, shallow: any = false, sep: any = defaultCaseSeparator) {
  if (!u) return u;

  if (typeof shallow === "string") return camelify(u, false, shallow);

  if (typeof u === "string")
    return u.replace(RegExp(`[${sep}](\\w)`, "g"), (_, a) => a.toUpperCase());

  if (Array.isArray(u))
    return u.map(v => typeof v === "object" ? camelify(v, shallow, sep) : v);

  return Object.entries(u).reduce((a, [k, v]) =>
    Object.assign(a, { [camelify(k, sep)]: shallow ? v : typeof v === "object" ? camelify(v, shallow, sep) : v }), {});
}

const snakifyRegExp = /(^[A-Z])|([A-Z])/g;

export function snakify<U, Sep extends string = typeof defaultCaseSeparator>(U: U, Sep?: Sep): Snakify<U, Sep>;
export function snakify<U, Shallow extends boolean, Sep extends string = typeof defaultCaseSeparator>(U: U, Shallow: Shallow, Sep?: Sep): Snakify<U, Sep, Shallow>;
export function snakify<S extends string, Sep extends string = typeof defaultCaseSeparator>(S: S, Sep?: Sep): Snakify<S, Sep>;
export function snakify<O extends object, Sep extends string = typeof defaultCaseSeparator>(O: O, Sep?: Sep): Snakify<O, Sep>;
export function snakify<O extends object, Shallow extends boolean, Sep extends string = typeof defaultCaseSeparator>(O: O, Shallow: Shallow, Sep?: Sep): Snakify<O, Sep, Shallow>;
export function snakify(u: unknown, shallow: any = false, sep: any = defaultCaseSeparator) {
  if (!u) return u;

  if (typeof shallow === "string") return snakify(u, false, shallow);

  if (typeof u === "string")
    return u.replace(snakifyRegExp, (_, a, b) => a ? a.toLowerCase() : `${sep}${b.toLowerCase()}`);

  if (Array.isArray(u))
    return u.map(v => typeof v === "object" ? snakify(v, shallow, sep) : v);

  return Object.entries(u).reduce((a, [k, v]) =>
    Object.assign(a, { [snakify(k, sep)]: shallow ? v : typeof v === "object" ? snakify(v, shallow, sep) : v }), {});
}
