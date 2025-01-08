export class SSet<T> {
  constructor() {
    Object.defineProperties(Array.prototype, {
      toArray: { value: this.toArray },
    });
  }

  /** @DJSProtofy */
  toArray() {
    return Array.from<T>(this as unknown as Set<T>);
  }
}
