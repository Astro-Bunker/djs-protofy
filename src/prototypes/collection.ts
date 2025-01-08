import { Collection } from "discord.js";

export class SCollection<K, V> {
  declare keys: Collection<K, V>["keys"];
  declare values: Collection<K, V>["values"];

  constructor() {
    Object.defineProperties(Collection.prototype, {
      keysToArray: { value: this.keysToArray },
      keysToSet: { value: this.keysToSet },
      valuesToArray: { value: this.valuesToArray },
      toJSON: { value: this.toJSON },
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
  toJSON() {
    return this.values().toArray();
  }
}
