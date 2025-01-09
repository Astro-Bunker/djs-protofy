import { randomInt } from "crypto";

export class SArray<T> {
  [n: number]: T
  declare length: Array<T>["length"];
  declare sort: Array<T>["sort"];

  constructor() {
    Object.defineProperties(Array.prototype, {
      random: { value: this.random },
      shuffle: { value: this.shuffle },
      toSet: { value: this.toSet },
    });
  }

  /**
   * @DJSProtofy
   * 
   * @returns `undefined` when array is `empty` and amount is `undefined`
   * @returns `array` when amount is `number`
   */
  random(amount?: number, allowDuplicates?: boolean) {
    if (typeof amount === "number") {
      if (this.length === 0 || isNaN(amount) || amount < 1) return [];

      const result = Array.from({ length: allowDuplicates ? amount : Math.min(amount, this.length) });

      if (allowDuplicates) {
        for (let i = 0; i < result.length; i++) {
          result[i] = this[randomInt(this.length)];
        }

        return result;
      }

      const clone = Array.from(this);

      for (let i = 0; i < result.length; i++) {
        result[i] = clone.splice(randomInt(clone.length), 1)[0];
      }

      return result;
    }

    if (this.length === 0) return;

    return this[randomInt(this.length)];
  }

  /** @DJSProtofy */
  shuffle() {
    return this.sort(() => Math.random() - 0.5);
  }

  /** @DJSProtofy */
  toSet() {
    return new Set<T>(this);
  }

  *[Symbol.iterator](): ArrayIterator<T> { }
}
