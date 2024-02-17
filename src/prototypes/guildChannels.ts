import { CategoryChannel, ChannelType, Client, Collection, GuildBasedChannel, GuildChannelManager, GuildChannelType } from "discord.js";
import { isRegExp } from "util/types";
import { GetChannelType, GuildChannelTypeString } from "../@types";
import { resolveEnum } from "../utils";

export class GuildChannels {
  declare cache: Collection<string, GuildBasedChannel>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(GuildChannelManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getByTopic: { value: this.getByTopic },
      getByTypes: { value: this.getByTypes },
      getByUrl: { value: this.getByUrl },
      getCategoryById: { value: this.getCategoryById },
      getCategoryByName: { value: this.getCategoryByName },
    });
  }

  getById<T extends ChannelType | keyof typeof ChannelType>(id: string, type?: T): GetChannelType<T> | undefined {
    if (typeof id !== "string") return;
    const channel = this.cache.get(id);
    if (type === undefined) return channel as GetChannelType<T>;
    if (channel?.type === resolveEnum(ChannelType, type)) return channel as GetChannelType<T>;
  }

  getByName<T extends ChannelType | keyof typeof ChannelType>(name: string | RegExp, type?: T): GetChannelType<T> | undefined {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(channel => {
      if (type && channel.type !== resolveEnum(ChannelType, type)) return false;

      if ("name" in channel && channel.name) {
        if (typeof name === "string") {
          return channel.name === name;
        }

        if (name instanceof RegExp)
          return name.test(channel.name);
      }
    }) as GetChannelType<T>;
  }

  getByTopic<T extends ChannelType | keyof typeof ChannelType>(topic: string | RegExp, type?: T): GetChannelType<T> | undefined {
    if (typeof topic !== "string" && !isRegExp(topic)) return;

    return this.cache.find(channel => {
      if (type && channel.type !== resolveEnum(ChannelType, type)) return false;

      if ("topic" in channel && channel.topic) {
        if (typeof topic === "string")
          return channel.topic === topic;

        if (topic instanceof RegExp)
          return topic.test(channel.topic);
      }
    }) as GetChannelType<T>;
  }

  getByTypes<T extends GuildChannelType | GuildChannelTypeString>(type: T | T[]): Collection<string, GetChannelType<T>> {
    if (Array.isArray(type)) {
      type.map(value => resolveEnum(ChannelType, value));
      return this.cache.filter(channel => type.includes(channel.type as T)) as any;
    }

    return this.cache.filter(channel => channel.type === resolveEnum(ChannelType, type)) as any;
  }

  getByUrl(url: string) {
    return this.cache.find(channel => channel.url === url);
  }

  getCategoryById(id: string): CategoryChannel | undefined {
    if (typeof id !== "string") return;
    const category = this.cache.get(id);
    if (category?.type !== ChannelType.GuildCategory) return;
    return category;
  }

  getCategoryByName(name: string | RegExp): CategoryChannel | undefined {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(channel => {
      if (channel.type !== ChannelType.GuildCategory) return false;

      if (typeof name === "string") {
        return channel.name === name;
      }

      return name.test(channel.name);
    }) as CategoryChannel;
  }
}
