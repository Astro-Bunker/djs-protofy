import { Collection } from "discord.js";

export class SCollection<K, V> {
  declare keys: Collection<K, V>["keys"];
  declare values: Collection<K, V>["values"];

  constructor() {
    Object.defineProperties(Collection.prototype, {
      keysToArray: { value: this.keysToArray },
      keysToSet: { value: this.keysToSet },
      valuesToArray: { value: this.valuesToArray },
      valuesToSet: { value: this.valuesToSet },
    });
  }

  /** @DJSProtofy */
  keysToArray() {
    return this.keys().toArray();
  }

  /** @DJSProtofy */
  keysToSet() {
    return new Set(this.keys());
  }

  /** @DJSProtofy */
  valuesToArray() {
    return this.values().toArray();
  }

  /** @DJSProtofy */
  valuesToSet() {
    return new Set(this.values());
  }
}
