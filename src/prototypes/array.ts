import { randomInt } from "crypto";

export class SArray<T> {
  [n: number]: T
  declare length: Array<T>["length"];
  declare sort: Array<T>["sort"];

  constructor() {
    Object.defineProperties(Array.prototype, {
      random: { value: this.random },
      shuffle: { value: this.shuffle },
    });
  }

  /** @DJSProtofy */
  random(amount?: number, allowDuplicates?: boolean) {
    if (typeof amount === "number") {
      if (isNaN(amount) || amount < 1) return [];

      if (allowDuplicates) return Array.from(Array(amount)).map(() => this[randomInt(this.length)]);

      amount = Math.min(amount, this.length);

      const clone = Array.from(this);

      return Array.from(Array(amount)).map(() => clone.splice(randomInt(clone.length), 1)[0]);
    }

    return this[randomInt(this.length)];
  }

  /** @DJSProtofy */
  shuffle() {
    return this.sort(() => Math.random() - 0.5);
  }
}
