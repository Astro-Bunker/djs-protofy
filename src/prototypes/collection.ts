import { Collection } from "discord.js";
import { MapIteratorHasToArrayMethod } from "../utils/types";

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
    return MapIteratorHasToArrayMethod ? this.keys().toArray() : Array.from(this.keys());
  }

  /** @DJSProtofy */
  keysToSet() {
    return new Set(this.keys());
  }

  /** @DJSProtofy */
  valuesToArray() {
    return MapIteratorHasToArrayMethod ? this.values().toArray() : Array.from(this.values());
  }

  /** @DJSProtofy */
  valuesToSet() {
    return new Set(this.values());
  }
}
