import { Collection } from "discord.js";

export class SCollection<K, V> {
  declare keys: Collection<K, V>["keys"];
  declare values: Collection<K, V>["values"];

  constructor() {
    Object.defineProperties(Collection.prototype, {
      keysToArray: { value: this.keysToArray },
      valuesToArray: { value: this.valuesToArray },
      toJSON: { value: this.toJSON },
    });
  }

  /** @DJSProtofy */
  keysToArray() {
    return Array.from(this.keys());
  }

  /** @DJSProtofy */
  valuesToArray() {
    return Array.from(this.values());
  }

  /** @DJSProtofy */
  toJSON() {
    return Array.from(this.values());
  }
}
