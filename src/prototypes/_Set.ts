export class SetExtension<T> {
  constructor() {
    Object.defineProperties(Set.prototype, {
      toArray: { value: this.toArray },
    });
  }

  /** @DJSProtofy */
  toArray() {
    return Array.from<T>(this);
  }

  *[Symbol.iterator](): SetIterator<T> { }
}
