
export type Snakify<T, Sep extends string = typeof defaultSnakeCaseSeparator, Shallow extends boolean = false> =
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

const defaultSnakeCaseSeparator = "_" as const;

export function snakify<U, Sep extends string>(U: U, Sep?: Sep): Snakify<U, Sep>;
export function snakify<U, Sep extends string, Shallow extends boolean>(U: U, Shallow: Shallow, Sep?: Sep): Snakify<U, Sep, Shallow>;
export function snakify<S extends string, Sep extends string>(S: S, Sep?: Sep): Snakify<S, Sep>;
export function snakify<O extends object, Sep extends string>(O: O, Sep?: Sep): Snakify<O, Sep>;
export function snakify<O extends object, Sep extends string, Shallow extends boolean>(O: O, Shallow: Shallow, Sep?: Sep): Snakify<O, Sep, Shallow>;
export function snakify(u: unknown, shallow: any = false, sep: any = defaultSnakeCaseSeparator) {
  if (!u) return u;

  if (typeof shallow === "string") return snakify(u, sep, shallow);

  if (typeof u === "string")
    return u.replace(/(^[A-Z])|([A-Z])/g, (_, a, b) => a ? a.toLowerCase() : `_${b.toLowerCase()}`);

  if (Array.isArray(u))
    return u.map(v => typeof v === "object" ? snakify(v, shallow, sep) : v);

  return Object.entries(u)
    .reduce((a, [k, v]) => Object.assign(a, { [snakify(k, sep)]: shallow ? v : typeof v === "object" ? snakify(v, shallow, sep) : v }), {});
}
