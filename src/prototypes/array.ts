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
  random(amount?: number, denyDuplicates?: boolean) {
    if (typeof amount === "number") {
      if (this.length === 0 || isNaN(amount) || amount < 1) return [];

      const length = denyDuplicates ? Math.min(amount, this.length) : amount;

      const result: T[] = [];
      let i = 0;

      if (denyDuplicates) {
        const clone = Array.from(this);

        while (i < length) result[i++] = clone.splice(Math.floor(Math.random() * clone.length), 1)[0];

        return result;
      }

      while (i < length) result[i++] = this[Math.floor(Math.random() * length)];

      return result;
    }

    if (this.length === 0) return;

    return this[Math.floor(Math.random() * this.length)];
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
