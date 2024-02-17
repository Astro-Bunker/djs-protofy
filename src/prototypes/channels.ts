import { APIChannel, CategoryChannel, Channel, ChannelManager, ChannelType, Client, Collection, VoiceBasedChannel } from "discord.js";
import { isRegExp } from "util/types";
import { GetChannelType } from "../@types";
import { compareStrings, resolveEnum, serializeRegExp } from "../utils";

export class Channels {
  declare cache: Collection<string, Channel>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(ChannelManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getByTopic: { value: this.getByTopic },
      getByUrl: { value: this.getByUrl },
      getCategoryById: { value: this.getCategoryById },
      getCategoryByName: { value: this.getCategoryByName },
      getInShardsById: { value: this.getInShardsById },
      getInShardsByName: { value: this.getInShardsByName },
      getVoiceByUserId: { value: this.getVoiceByUserId },
      filterByTypes: { value: this.filterByTypes },
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
          return compareStrings(channel.name, name);
        }

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
          return compareStrings(channel.topic, topic);

        return topic.test(channel.topic);
      }
    }) as GetChannelType<T>;
  }

  getByUrl(url: string) {
    return this.cache.find(channel => channel.url === url);
  }

  getCategoryById(id: string) {
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
        return compareStrings(channel.name, name);
      }

      return name.test(channel.name);
    }) as CategoryChannel;
  }

  async getInShardsById(id: string) {
    if (typeof id !== "string" || !this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, id) => shard.channels.getById(id), { context: id })
      .then(res => res.find(Boolean) as APIChannel ?? null)
      .catch(() => null);
  }

  async getInShardsByName(name: string | RegExp) {
    if ((typeof name !== "string" && !isRegExp(name)) || !this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.channels.getByName(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as APIChannel ?? null)
      .catch(() => null);
  }

  getVoiceByUserId(id: string): VoiceBasedChannel | undefined {
    if (typeof id !== "string") return;

    return this.cache.find((channel) => {
      if (!channel.isVoiceBased()) return false;

      return channel.members.has(id);
    }) as VoiceBasedChannel;
  }

  filterByTypes<T extends ChannelType | keyof typeof ChannelType>(type: T | T[]): Collection<string, GetChannelType<T>> {
    if (Array.isArray(type)) {
      type.map(value => resolveEnum(ChannelType, value));
      return this.cache.filter(channel => type.includes(channel.type as T)) as any;
    }

    return this.cache.filter(channel => channel.type === resolveEnum(ChannelType, type)) as any;
  }

}
