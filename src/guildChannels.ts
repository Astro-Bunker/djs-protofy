import { ChannelType, Collection, GuildChannelManager } from "discord.js";
import { resolveEnum } from "./utils";

export class GuildChannels {
  declare cache: GuildChannelManager["cache"];

  constructor() {
    Object.defineProperties(GuildChannelManager.prototype, {
      getById: { value: this.getChannelById },
      getByName: { value: this.getChannelByName },
      getByTopic: { value: this.getChannelByTopic },
      getByTypes: { value: this.getChannelsByTypes },
      getCategoryById: { value: this.getCategoryById },
      getCategoryByName: { value: this.getCategoryByName },
      getByUrl: { value: this.getChannelByUrl },
    });
  }

  getChannelById<T extends ChannelType | keyof typeof ChannelType>(id: string, type?: T) {
    if (typeof id !== "string") return;
    const channel = this.cache.get(id);
    if (!type) return channel;
    if (channel?.type === resolveEnum(ChannelType, type)) return channel;
  }

  getChannelByName<T extends ChannelType | keyof typeof ChannelType>(name: string | RegExp, type?: T) {
    if (!name) return;

    return this.cache.find(channel => {
      if (type && channel.type !== resolveEnum(ChannelType, type)) return false;

      if ("name" in channel && channel.name) {
        if (typeof name === "string") {
          return channel.name === name;
        }

        if (name instanceof RegExp)
          return name.test(channel.name);
      }
    });
  }

  getChannelByTopic<T extends ChannelType | keyof typeof ChannelType>(topic: string | RegExp, type?: T) {
    if (!topic) return;

    return this.cache.find(channel => {
      if (type && channel.type !== resolveEnum(ChannelType, type)) return false;

      if ("topic" in channel && channel.topic) {
        if (typeof topic === "string")
          return channel.topic === topic;

        if (topic instanceof RegExp)
          return topic.test(channel.topic);
      }
    });
  }

  getChannelsByTypes<T extends ChannelType | keyof typeof ChannelType>(type: T | T[]): Collection<string, T> {
    if (Array.isArray(type)) {
      type.map(value => resolveEnum(ChannelType, value));
      return this.cache.filter(channel => type.includes(channel.type as T)) as any;
    }

    return this.cache.filter(channel => channel.type === resolveEnum(ChannelType, type)) as any;
  }

  getCategoryById(id: string) {
    if (typeof id !== "string") return;
    const category = this.cache.get(id);
    if (category?.type !== ChannelType.GuildCategory) return;
    return category;
  }

  getCategoryByName(name: string | RegExp) {
    if (!name) return;

    return this.cache.find(channel => {
      if (channel.type !== ChannelType.GuildCategory) return false;

      if ("name" in channel && channel.name) {
        if (typeof name === "string") {
          return channel.name === name;
        }

        if (name instanceof RegExp)
          return name.test(channel.name);
      }
    });
  }

  getChannelByUrl(url: string) {
    return this.cache.find(channel => channel.url === url);
  }
}
