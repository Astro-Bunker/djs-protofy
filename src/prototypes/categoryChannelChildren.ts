import { CategoryChannelChildManager, ChannelType, Collection } from "discord.js";
import { ChannelTypeString, ChannelWithType } from "../@types";
import { resolveEnum } from "../utils";

export class CategoryChannelChildren {
  declare cache: CategoryChannelChildManager["cache"]

  constructor() {
    Object.defineProperties(CategoryChannelChildren.prototype, {
      filterByTypes: { value: this.filterByTypes }
    });
  }

  /** @DJSProtofy */
  filterByTypes<T extends ChannelType | ChannelTypeString>(type: T | T[]): Collection<string, ChannelWithType<T>>;
  filterByTypes<T extends ChannelType | ChannelTypeString>(type: T | T[]) {
    if (Array.isArray(type)) {
      type.map(value => resolveEnum(ChannelType, value));
      return this.cache.filter(channel => type.includes(channel.type as T));
    }

    const resolvedType = resolveEnum(ChannelType, type);

    return this.cache.filter(channel => channel.type === resolvedType);
  }
}