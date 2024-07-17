import { randomInt } from "crypto";

export class SArray<T> {
  [n: number]: T
  declare find: Array<T>["find"];
  declare findIndex: Array<T>["findIndex"];
  declare length: Array<T>["length"];
  declare map: Array<T>["map"];
  declare push: Array<T>["push"];
  declare sort: Array<T>["sort"];

  constructor() {
    Object.defineProperties(Array.prototype, {
      edit: { value: this.edit },
      random: { value: this.random },
      shuffle: { value: this.shuffle },
    });
  }

  /** @DJSProtofy */
  edit(
    filter: (value: T, index: number, array: T[]) => boolean,
    edit: (value: T, index: number, array: T[]) => T,
    orPush?: () => T,
  ) {
    let push = true;

    for (let i = 0; i < this.length; i++) {
      if (filter(this[i], i, this as any)) {
        this[i] = edit(this[i], i, this as any);
        push = false;
        break;
      }
    }

    if (push && typeof orPush === "function") this.push(orPush());
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

      if (allowDuplicates) return Array.from(Array(amount)).map(() => this[randomInt(this.length)]);

      const clone = Array.from(this);

      return Array.from(Array(Math.min(amount, this.length))).map(() => clone.splice(randomInt(clone.length), 1)[0]);
    }

    if (this.length === 0) return;

    return this[randomInt(this.length)];
  }

  /** @DJSProtofy */
  shuffle() {
    return this.sort(() => Math.random() - 0.5);
  }
}
