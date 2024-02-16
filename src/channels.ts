import { ChannelType, Client, Collection } from "discord.js";

export default class Channels {
  constructor(protected client: Client) {
    client.channels.getById = this.getChannelById;
    client.channels.getByName = this.getChannelByName;
    client.channels.getByTopic = this.getChannelByTopic;
    client.channels.getByTypes = this.getChannelsByTypes;
    client.channels.getCategoryById = this.getCategoryById;
    client.channels.getCategoryByName = this.getCategoryByName;
  }

  getChannelById<T extends ChannelType>(id: string, type?: T) {
    if (typeof id !== "string") return;
    const channel = this.client.channels.cache.get(id);
    if (!type) return channel;
    if (channel?.type === type) return channel;
  }

  getChannelByName<T extends ChannelType>(name: string | RegExp, type?: T) {
    if (!name) return;
    return this.client.channels.cache.find(channel => {
      if (type && channel.type !== type) return false;

      if ("name" in channel && channel.name) {
        if (typeof name === "string") {
          return channel.name === name;
        }

        if (name instanceof RegExp)
          return name.test(channel.name);
      }
    });
  }

  getChannelByTopic<T extends ChannelType>(topic: string | RegExp, type?: T) {
    if (!topic) return;
    return this.client.channels.cache.find(channel => {
      if (type && channel.type !== type) return false;

      if ("topic" in channel && channel.topic) {
        if (typeof topic === "string")
          return channel.topic === topic;

        if (topic instanceof RegExp)
          return topic.test(channel.topic);
      }
    });
  }

  getChannelsByTypes<T extends ChannelType>(type: T | T[]): Collection<string, T> {
    if (Array.isArray(type))
      return this.client.channels.cache.filter(channel => type.includes(channel.type as T)) as any;

    return this.client.channels.cache.filter(channel => channel.type === type) as any;
  }

  getCategoryById(id: string) {
    if (typeof id !== "string") return;
    const category = this.client.channels.cache.get(id);
    if (category?.type !== ChannelType.GuildCategory) return;
    return category;
  }

  getCategoryByName(name: string | RegExp) {
    if (!name) return;
    return this.client.channels.cache.find(channel => {
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

}